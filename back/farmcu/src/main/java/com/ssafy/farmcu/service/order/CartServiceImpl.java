package com.ssafy.farmcu.service.order;

import com.ssafy.farmcu.dto.order.CartOrderDto;
import com.ssafy.farmcu.dto.order.CartRequestDto;
import com.ssafy.farmcu.dto.order.OrderDto;
import com.ssafy.farmcu.entity.member.Member;
import com.ssafy.farmcu.entity.order.Cart;
import com.ssafy.farmcu.entity.store.Item;
import com.ssafy.farmcu.exception.ItemNotFoundException;
import com.ssafy.farmcu.repository.CartRepository;
import com.ssafy.farmcu.repository.ItemRepository;
import com.ssafy.farmcu.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Component

// @Transactional 사용해서 item 이 품절되거나 삭제 되었을 경우 진행하던 작업 원상복귀 처리 =====> 나중에 구현
public class CartServiceImpl implements CartService{

    @Autowired
    private final CartRepository cartRepository;
    private final ItemRepository itemRepository;
    private final MemberRepository memberRepository;
    private final OrderServiceImpl orderServiceImpl;

    // 구현 기능

    // Service method
    //
    //- find
    //- save ex) saveItem
    //- delete
    //- update

    //** 현재 로그인 한 member 장바구니 조회  **//
    public List<Cart> findMyCart(Member member) {
        return cartRepository.findByMember(member);
    }

     //** 장바구니 상품 추가 **//
    public Long addCart(CartRequestDto cartDto, String Id) {
        Item item = itemRepository.findById(cartDto.getItemId()).orElseThrow(() -> new ItemNotFoundException("상품에 대한 정보가 없습니다."));
        Member member = memberRepository.findById(Id);

        //** 장바구니 만들기 **//
        Cart cart = Cart.createCart(member, item, cartDto.getCartItemCount());
        cartRepository.save(cart);

        return cart.getCartId();
    }

    //** 장바구니 상품 주문  **//
    //memberRepository의 id 는 pk 가 아니라 회원가입 아이디
    //save로 수정?
    public Long orderCart(List<CartOrderDto> cartOrderDtoList, String id){
        List<OrderDto> orderDtoList = new ArrayList<>(); //장바구니 리스트

        for(CartOrderDto CartOrderDto : cartOrderDtoList){ //장바구니 항목들 정리
            Cart cart = cartRepository.findById(CartOrderDto.getCartId()).orElseThrow();//고객이 담은 장바구니 항목 불러오기
            OrderDto orderDto = new OrderDto();
            orderDto.setItem_id(cart.getItem().getItemId()); //상품번호
            orderDto.setOrderCount(cart.getCartItemCount()); //수량
            orderDtoList.add(orderDto);
        }

        // 주문 로직
        Long orderId = orderServiceImpl.orders(orderDtoList, id);


        //** 주문완료 후 장바구니 삭제 **//
        for (CartOrderDto cartOrderDto : cartOrderDtoList){
            Cart cart = cartRepository.findById(cartOrderDto.getCartId()).orElseThrow();
            cartRepository.delete(cart);
        }
        return orderId;
    }

    //** 장바구니 삭제 **//
    public void deleteById(Long id) { cartRepository.deleteById(id); }


}