package com.ssafy.farmcu.dto.order;

import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class OrderDto {
    @NotNull
    private Long item_id;

    private int orderCount;
    private List<OrderDto> OrderDtoList;
}
