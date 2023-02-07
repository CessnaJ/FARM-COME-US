package com.ssafy.farmcu.api.dto.store;

import com.ssafy.farmcu.api.entity.store.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemDto {

    private Long itemId;
    private String itemName;
    private String itemDescription;
    private int itemPrice;
    private int itemDiscount;
    private int itemStock;
    private String itemCreatedAt;
    private String categoryName;
    private Long storeId;

    public ItemDto(Item item) {
        this.itemId = item.getItemId();
        this.itemName = item.getItemName();
        this.itemDescription = item.getItemDescription();
        this.itemPrice = item.getItemPrice();
        this.itemDiscount = item.getItemDiscount();
        this.itemStock = item.getItemStock();
        this.itemCreatedAt = item.getItemCreatedAt().toString();
        this.categoryName = item.getCategoryDetail().getDetailName();
        this.storeId = item.getStore().getStoreId();
    }

    @Override
    public String toString() {
        return "ItemDto{" +
                "itemId=" + itemId +
                ", itemName='" + itemName + '\'' +
                ", itemDescription='" + itemDescription + '\'' +
                ", itemPrice=" + itemPrice +
                ", itemDiscount=" + itemDiscount +
                ", itemStock=" + itemStock +
                ", itemCreatedAt='" + itemCreatedAt + '\'' +
                ", categoryName='" + categoryName + '\'' +
                ", storeId=" + storeId +
                '}';
    }

}
