package com.ssafy.farmcu.service.member;

import com.ssafy.farmcu.dto.member.MemberJoinReq;
import com.ssafy.farmcu.dto.member.MemberLoginReq;
import com.ssafy.farmcu.dto.member.MemberUpdateReq;
import com.ssafy.farmcu.dto.member.MemberInfoRes;
import com.ssafy.farmcu.entity.member.Member;

public interface MemberService {

    // 회원 가입
    public boolean createMember(MemberJoinReq memberJoinInfo);
    // 회원 조회
    public Member getMemberById(String Id);
    public MemberInfoRes getMemberPhoto(String Id);
    // 회원 삭제
    public boolean deleteMember(MemberLoginReq memberLoginReq);

    // 회원 정보 수정
    public boolean updateMember(MemberUpdateReq memberUpdateReq, String id);
}
