package com.ssafy.farmcu.api.dto.order;

import com.ssafy.farmcu.api.entity.order.Cart;
import com.ssafy.farmcu.api.entity.store.Item;
import com.sun.istack.NotNull;
import lombok.*;

import java.security.Timestamp;

@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartInfoDto {

    Long cartId;
    Long memberId;
    Long itemId;
    int getTotalPrice;
    int cartItemCount;

    public CartInfoDto(Cart cart) {
        this.cartId = cart.getCartId();
        this.memberId = cart.getMember().getMemberId();
        this.itemId = cart.getItem().getItemId();
        this.getTotalPrice = cart.getTotalPrice();
        this.cartItemCount = cart.getCartItemCount();
    }


}
