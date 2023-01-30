package com.ssafy.farmcu.dto.request.item;

import com.ssafy.farmcu.entity.store.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ItemSearchReq {

    String itemName;
    Category category;

}
