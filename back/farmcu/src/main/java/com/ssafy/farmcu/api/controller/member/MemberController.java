package com.ssafy.farmcu.api.controller.member;

import com.ssafy.farmcu.api.dto.ErrorResponse;
import com.ssafy.farmcu.api.dto.member.MemberJoinReq;
import com.ssafy.farmcu.api.dto.member.MemberLoginReq;
import com.ssafy.farmcu.api.dto.member.MemberResponseDto;
import com.ssafy.farmcu.api.dto.member.MemberUpdateReq;
import com.ssafy.farmcu.api.entity.member.Member;
import com.ssafy.farmcu.api.entity.member.MemberRefreshToken;
import com.ssafy.farmcu.api.service.member.MemberRefreshTokenServiceImpl;
import com.ssafy.farmcu.oauth.repository.MemberRefreshTokenRepository;
import com.ssafy.farmcu.oauth.token.AuthToken;
import com.ssafy.farmcu.oauth.token.AuthTokenProvider;
import com.ssafy.farmcu.oauth.token.JwtServiceImpl;
import com.ssafy.farmcu.api.service.member.MemberServiceImpl;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/member")
@RestController
@Api("사용자 컨트롤러 API v1")
public class MemberController {

    private final MemberServiceImpl memberService;
    private final MemberRefreshTokenRepository refreshTokenRepository;
    private final AuthTokenProvider tokenProvider;

    private final JwtServiceImpl jwtService;
    private final MemberRefreshTokenServiceImpl refreshService;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;

    @PostMapping("/join")
    @ApiOperation(value="회원 가입", notes = "")
    public ResponseEntity joinMember(@Validated @RequestBody MemberJoinReq request){
        log.debug("MemberJoinReq DTO : {}", request);
        Member loginMember = memberService.findUser(request.getId());
        if(loginMember!=null)
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE)
                .body(new ErrorResponse("error.already.exit"));
        if(memberService.createMember(request)){
            return new ResponseEntity<String>("success", HttpStatus.ACCEPTED);
        }
        else {
            return new ResponseEntity<String>("error", HttpStatus.BAD_REQUEST);
        }

    }


    @DeleteMapping
    @ApiOperation(value="회원 탈퇴", notes = "")
    public ResponseEntity<?> deleteMember(@RequestHeader(value="Authorization") String token, @RequestBody MemberLoginReq request){
//        if(!tokenProvider.convertAuthToken(token).validate()){
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(new ErrorResponse(messageSource.getMessage("error.jwt", null, LocaleContextHolder.getLocale())));
//        }
        if(refreshTokenRepository.findByIdAndRefreshToken(request.getId(), token) != null){
            memberService.deleteMember(request);
            SecurityContextHolder.clearContext();

            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(messageSource.getMessage("error.jwt", null, LocaleContextHolder.getLocale())));
    }

    @PostMapping("/login")
    @ApiOperation(value = "일반 로그인", notes = "access-Token, refresh-Token, 로그인 결과 메시지", response = Map.class)
    public ResponseEntity<?> login(@RequestBody MemberLoginReq loginReq){
        Member loginMember = memberService.findUser(loginReq.getId());
        log.info("here login start");
        if(loginMember==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error.not.exist.user"));
        }
        if(!passwordEncoder.matches(loginReq.getPassword(), loginMember.getPassword())){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("error.wrong.pw"));
        }
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = null;

        try {

            String accessToken = jwtService.createAccessToken("userid", loginMember.getMemberId());
            String refreshToken = jwtService.createRefreshToken("userid", loginMember.getMemberId());
            resultMap.put("access-token", accessToken);
            resultMap.put("refresh-token", refreshToken);
            resultMap.put("message", "success");
            status = HttpStatus.ACCEPTED;
            log.info("status : {}", status);

            // DB 저장
//            MemberRefreshToken memberRefreshToken = refreshTokenRepository.findById(loginMember.getId());
//            MemberRefreshToken memberRefreshToken =
            if (refreshService.refreshTokenExists(loginMember.getId())) {
                System.out.println("// 처음 로그인하는 사용자라면, 토큰 저장");
//                memberRefreshToken.setRefreshToken(refreshToken);
                refreshService.saveRefreshTokenTable(refreshToken, loginMember.getId());

            } else {
                System.out.println("// 이미 리프레시 토큰을 가지고 있다면 만들어서 저장");
                refreshService.saveRefreshTokenTable(refreshToken, loginMember.getId());
            }
        }catch (Exception e){
            e.printStackTrace();
            resultMap.put("message", "fail");
            status = HttpStatus.ACCEPTED;
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }


    @ApiOperation(value = "로그아웃", notes = "회원 정보를 담은 Token을 제거한다.", response = Map.class)
    @GetMapping("/logout/{memberid}")
    public ResponseEntity<?> removeToken(@PathVariable("memberid") String memberid) {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        try {
            refreshTokenRepository.deleteById(memberid);
            resultMap.put("message", "success");
            status = HttpStatus.ACCEPTED;
        } catch (Exception e) {

            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);

    }

    @ApiOperation(value = "Access Token 재발급", notes = "만료된 access token을 재발급받는다.", response = Map.class)
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody MemberResponseDto memberDto, HttpServletRequest request) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String token = request.getHeader("token"); // 리프레시 토큰
        if (jwtService.checkToken(token)) {
            if (token.equals(refreshTokenRepository.findById(memberDto.getId()).getRefreshToken())) {
                String accessToken = jwtService.createAccessToken("userid", memberDto.getId());
//                logger.debug("token : {}", accessToken);
//                logger.debug("정상적으로 액세스토큰 재발급!!!");
                resultMap.put("access-token", accessToken);
                resultMap.put("message", "success");
                status = HttpStatus.ACCEPTED;
            }
        } else {
//            logger.debug("리프레쉬토큰도 사용불!!!!!!!");
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @ApiOperation(value = "회원 정보 수정", notes = "", response = Map.class)
    @PutMapping("/{memberid}")
    public ResponseEntity<?> refreshToken(@RequestBody MemberUpdateReq requset, @RequestParam String memberid, HttpServletRequest request) throws Exception {
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String token = request.getHeader("token"); // 리프레시 토큰
        String id = jwtService.getUserId();
        if (jwtService.checkToken(token)) {
            if (token.equals(refreshTokenRepository.findById(memberid).getRefreshToken())) {
                String accessToken = jwtService.createAccessToken("userid", memberid);
//                logger.debug("token : {}", accessToken);
//                logger.debug("정상적으로 액세스토큰 재발급!!!");
                resultMap.put("access-token", accessToken);
                resultMap.put("message", "success");
                status = HttpStatus.ACCEPTED;
            }
        } else {
//            logger.debug("리프레쉬토큰도 사용불!!!!!!!");
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<?> selectMemberInfo(@PathVariable("memberId") Long memberId, HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        if (jwtService.checkToken(request.getHeader("token"))) {
            log.info("token is avvailable!");
            try{
                MemberResponseDto memberDto = memberService.getUserInfo(memberId);
                resultMap.put("userInfo", memberDto);
                resultMap.put("message", "success");
                status = HttpStatus.ACCEPTED;
            }catch(Exception e){
                log.debug("정보 조회 실패 : ", e);
                resultMap.put("message", e.getMessage());
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }else{
            log.info("사용 불가능한 토큰");
            resultMap.put("message", "fail");
            status = HttpStatus.UNAUTHORIZED;
        }
        return  new ResponseEntity<>(resultMap, status);

    }

    @GetMapping("/")
    public ResponseEntity<?> selectMemberInfo( HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String token = request.getHeader("token");
        AuthToken authToken = tokenProvider.convertAuthToken(token);

        if (jwtService.checkToken(request.getHeader("token"))) {
            log.info("token is avvailable!");
            try{
                Long id = tokenProvider.getId(authToken);
//                MemberResponseDto memberDto = memberService.getUserInfo(memberId);
                MemberResponseDto memberDto = memberService.getUserInfo(id);
                resultMap.put("userInfo", memberDto);
                resultMap.put("message", "success");
                status = HttpStatus.ACCEPTED;
            }catch(Exception e){
                log.debug("정보 조회 실패 : ", e);
                resultMap.put("message", e.getMessage());
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }else{
            log.info("사용 불가능한 토큰");
            resultMap.put("message", "fail");
            status = HttpStatus.UNAUTHORIZED;
        }
        return  new ResponseEntity<>(resultMap, status);

    }
    @GetMapping("/me/{id}")
    public ResponseEntity<MemberResponseDto> fetchUser(@PathVariable Long id) {
        log.info("/me");
        MemberResponseDto memberDto = memberService.getUserInfo(id);
        return ResponseEntity.ok(memberDto);
    }





}