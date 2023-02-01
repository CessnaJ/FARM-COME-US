package com.ssafy.farmcu.dto;

import com.ssafy.farmcu.entity.store.Category;
import com.ssafy.farmcu.entity.store.Item;
import com.ssafy.farmcu.entity.store.Store;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {

    Long itemId;
    String itemName;
    String itemDescription;
    String itemImg;
    int itemPrice;
    int itemDiscount;
    int itemStock;
    String itemCreatedAt;
    Long categoryCode;
    Long storeId;

    public ItemDto(Item item) {
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemDescription = item.getItemDescription();
        this.itemImg = item.getItemImg();
        this.itemPrice = item.getItemPrice();
        this.itemDiscount = item.getItemDiscount();
        this.itemStock = item.getItemStock();
        this.itemCreatedAt = item.getItemCreatedAt().toString();
        this.categoryCode = item.getCategory().getCategoryCode();
        this.storeId = item.getStore().getStoreId();
    }

}
