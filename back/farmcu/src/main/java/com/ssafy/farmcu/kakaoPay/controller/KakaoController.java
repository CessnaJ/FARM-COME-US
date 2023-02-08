package com.ssafy.farmcu.kakaoPay.controller;



import com.ssafy.farmcu.kakaoPay.dto.KaKaoPayDTO;
import com.ssafy.farmcu.api.entity.member.Member;
import com.ssafy.farmcu.api.service.member.MemberService;
import com.ssafy.farmcu.kakaoPay.service.KakaoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.NoSuchElementException;

@RestController
@Component
@RequestMapping("/kakao")
@Api(value = "pay API")
public class KakaoController {

    //오류
//    private final KakaoService kakaoService;
//    private final MemberService memberService;
//
//    @Autowired
//    public KakaoController(KakaoService kakaoService, MemberService memberService) {
//        this.kakaoService = kakaoService;
//        this.memberService = memberService;
//    }

    private final KakaoService kakaoService;
    private final MemberService memberService;

    KakaoController(@Lazy KakaoService kakaoService, @Lazy MemberService memberService) {
        this.kakaoService = kakaoService;
        this.memberService = memberService;
    }

    // Client 에서 카카오 인증들 통해서 받은 인가코드 받기
    // 카카오 로그인 순서 -> 1. (클라이언트 -> 카카오서버) : 인가 코트 요청 /
    @GetMapping
    @ApiOperation(value = "카카오 로그인")
    public ResponseEntity<?> KaKaoLogIn(@RequestParam("code") String code, HttpServletResponse response) {


        System.out.println("KaKaoLogIn() 진입 KaKao -> Controller -> p31 ");
        System.out.println("카카오 인가 코드@@@@@@@@@@@@@@ : " + code);

        try {
            // 받아온 code를 작성한 양식에 맞춰서 카카오 유저 생성
            Member kakaoUser = kakaoService.Create(code);
            System.out.println("kakaoService.Create(code) KaKao -> Controller -> p38 ");
            // 카카오 유저가 생성되면 해당 데이터로 JWT 토큰 생성
//            String kakaoToken = MemberRefreshToken.RefreshTokenTable(kakaoUser);

            return ResponseEntity.ok().body(new HashMap<>() {{
//                put("token", kakaoToken);
                put("kakaoInfo", kakaoUser);

            }});
        } catch (NullPointerException e) {
            return ResponseEntity.status(500).body("데이터를 찾을 수 없습니다.\n" + e);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(500).body("해당 카카오 데이터 ‘조회’ 할 수 없습니다. \n" + e);

        }
    }

    @GetMapping("/logout")
    @ApiOperation(value = "카카오 로그아웃")
    public ResponseEntity<?> KaKaoLogOut(@RequestParam String code) {

        try {

            Object kakaoLogout = kakaoService.getAccessToken(code);
            return ResponseEntity.ok().body(kakaoLogout);
        } catch (NullPointerException e) {
            return ResponseEntity.status(500).body("데이터를 찾을 수 없습니다.\n" + e);
        }

    }

    // 카카오페이 결제
    @PostMapping("kakaopay")
    @ApiOperation(value = "카카오 페이 결제")
    public String KakaoPay(@RequestBody KaKaoPayDTO kaKaoPayDTO) {

        // kaKaoPayDTO 에 맞춰서 카카오페이 결제 진행
        String kaKaoPay = kakaoService.KaKaoPay(kaKaoPayDTO);

        return kaKaoPay;
    }

    // 카카오 페이 결제가 성공적으로 진행됬을 경우
    @GetMapping("/success")
    @ApiOperation(value = "카카오 페이 결제 성공")
    public ResponseEntity KaKaoSuccess(@RequestParam String pg_token) {

        String kakaoaAprove = kakaoService.KakaoAprove(pg_token);

        return ResponseEntity.ok().body(kakaoaAprove);
    }

    // 카카오 페이 결제가 취소 됬을 경우
    @GetMapping("/cancel")
    @ApiOperation(value = "카카오 페이 결제 취소")
    public String KaKaoCancel() {

        return "카카오 결제 취소";
    }


    // 카카오 페이 결제가 실패 했을 경우
    @GetMapping("/fail")
    @ApiOperation(value = "카카오 페이 결제 실패")
    public String KaKaoFail() {

        return "카카오 결제 실패";
    }

}