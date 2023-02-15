package com.ssafy.farmcu.api.service.order;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.farmcu.api.dto.order.pay.GeneralPayDto;
import com.ssafy.farmcu.api.dto.order.pay.KakaoPayApproveDto;
import com.ssafy.farmcu.api.dto.order.pay.KakaoReqDto;
import com.ssafy.farmcu.api.entity.order.Cart;
import com.ssafy.farmcu.api.entity.order.Order;
import com.ssafy.farmcu.api.entity.order.OrderItem;
import com.ssafy.farmcu.api.entity.order.pay.KaKaoPay;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PayService {

    private final OrderServiceImpl orderService;
    private final String PARTNER_USER_ID = "pillivery";
    private final String KAKAO_APPROVE_URL = "https://kapi.kakao.com/v1/payment/approve";
    private Long order_id;

    public KakaoReqDto kakaoPayRequest(int totalPrice, int quantity, Long orderId, Long memberId){

        Order order = orderService.updateOrder(orderId);
        List<OrderItem> orderItems = orderService.findOrderDetail(order);

        int itemQuantity = quantity;
        String itemName = orderItems.get(0).getItem().getItemName();
        order_id = orderId;
//        member_id = memberId;

        MultiValueMap<String, String> parameters;
        parameters = getRequestParams(totalPrice, quantity, itemName, order_id);
//        parameters = isSubscription(parameters, order);

        log.info("parameters = {}", parameters);

        HttpEntity<MultiValueMap<String, String>> kakaoRequestEntity = new HttpEntity<>(parameters, getKakaoHeader());

        String url = "https://kapi.kakao.com/v1/payment/ready";
        RestTemplate restTemplate = new RestTemplate();
        KakaoReqDto requestResponse = restTemplate.postForObject(url, kakaoRequestEntity, KakaoReqDto.class);
        log.info("결제 준비 응답객체 " + requestResponse);

        return requestResponse;
    }

    public KakaoPayApproveDto kakaoPayApprove(String tid, String pgToken ){
        MultiValueMap<String, String> parameters;

        parameters = getApproveParams(tid, pgToken, order_id);

        KakaoPayApproveDto kakaoPayApproveDto = getKakaoPayApproveDto(parameters);

        return kakaoPayApproveDto;
    }

//    public KakaoPayApproveDto kakaoSubsPayApprove( String tid, String pgToken ){
//
//        MultiValueMap<String, String> parameters;
//        parameters = getSubsApproveParams(tid, pgToken, order_id);
//        KakaoPayApproveDto kakaoPayApproveDto = getKakaoPayApproveDto(parameters);
//
//        return kakaoPayApproveDto;
//    }

    private KakaoPayApproveDto getKakaoPayApproveDto( MultiValueMap<String, String> parameters ){

        HttpEntity<MultiValueMap<String, String>> kakaoRequestEntity = new HttpEntity<>(parameters, getKakaoHeader());
        RestTemplate restTemplate = new RestTemplate();
        KakaoPayApproveDto kakaoPayApproveDto = restTemplate.postForObject(KAKAO_APPROVE_URL, kakaoRequestEntity, KakaoPayApproveDto.class);
        log.info("결제 승인 응답 객체" + kakaoPayApproveDto);
        return kakaoPayApproveDto;
    }

    private MultiValueMap<String, String> getApproveParams( String tid, String pgToken, Long order_id ){ //TODO : 파라미터 추가

        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();

        parameters.add("cid", "TC0ONETIME");
        parameters.add("tid", tid);
        parameters.add("partner_order_id", String.valueOf(order_id));
        parameters.add("partner_user_id", PARTNER_USER_ID);
        parameters.add("pg_token", pgToken);

        return parameters;
    }

    private MultiValueMap<String, String> getSubsApproveParams( String tid, String pgToken, Long order_id ){ //TODO : 파라미터 추가
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();

        parameters.add("cid", "TCSUBSCRIP");
        parameters.add("tid", tid);
        parameters.add("partner_order_id", String.valueOf(order_id));
        parameters.add("partner_user_id", PARTNER_USER_ID);
        parameters.add("pg_token", pgToken);

        return parameters;
    }

    private MultiValueMap<String, String> getRequestParams( int totalAmount, int quantity, String item_name, Long order_Id ){ //TODO: 파라미터 추가
        MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>();

        parameters.add("partner_order_id", String.valueOf(order_Id));
        parameters.add("partner_user_id", PARTNER_USER_ID);
        parameters.add("item_name", item_name);
        parameters.add("quantity", String.valueOf(quantity));
        parameters.add("total_amount", String.valueOf(totalAmount));
        parameters.add("tax_free_amount", "0");
        parameters.add("cid", "TC0ONETIME");
        parameters.add("approval_url", "https://localhost:9090");
        parameters.add("cancel_url", "https://localhost:9090");
        parameters.add("fail_url", "https://localhost:9090");

        return parameters;
    }

    private HttpHeaders getKakaoHeader(){
        HttpHeaders httpHeaders = new HttpHeaders();
        // 지은 adminKey 임시 사용
        httpHeaders.set("Authorization", "KakaoAK 89fc92ccb362f6b19e4e91d5fefc990d");
        httpHeaders.set("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        return httpHeaders;
    }


}
