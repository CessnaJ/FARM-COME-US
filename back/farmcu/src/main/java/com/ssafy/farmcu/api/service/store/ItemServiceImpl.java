package com.ssafy.farmcu.api.service.store;

import com.ssafy.farmcu.api.dto.store.ItemDto;
import com.ssafy.farmcu.api.dto.store.ItemListRes;
import com.ssafy.farmcu.api.dto.store.ItemSearchReq;
import com.ssafy.farmcu.api.entity.store.CategoryDetail;
import com.ssafy.farmcu.api.entity.store.Item;
import com.ssafy.farmcu.api.entity.store.Store;
import com.ssafy.farmcu.api.repository.CategoryDetailRepository;
import com.ssafy.farmcu.api.repository.ItemRepository;
import com.ssafy.farmcu.api.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;

import java.awt.event.ItemListener;
import java.util.HashMap;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final CategoryDetailRepository categoryDetailRepository;
    private final StoreRepository storeRepository;
    private final ItemRepository itemRepository;

    @Override
    public boolean saveItem(ItemDto itemDto) {
        try {
            System.out.println("itemDto : " + itemDto.toString());
            CategoryDetail categoryDetail = categoryDetailRepository.findByDetailName(itemDto.getCategoryName());
            Store store = storeRepository.findByStoreId(itemDto.getStoreId()).orElseThrow(NullPointerException::new);
            Item item = Item.builder()
                    .itemName(itemDto.getItemName())
                    .itemDescription(itemDto.getItemDescription())
                    .itemPrice(itemDto.getItemPrice())
                    .itemDiscount(itemDto.getItemDiscount())
                    .itemStock(itemDto.getItemStock())
                    .categoryDetail(categoryDetail)
                    .store(store)
                    .build();

            itemRepository.save(item);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean updateItem(ItemDto itemDto) {
        try {
            CategoryDetail categoryDetail = categoryDetailRepository.findByDetailName(itemDto.getCategoryName());
            Store store = storeRepository.findByStoreId(itemDto.getStoreId()).orElseThrow(NullPointerException::new);
            Item item = itemRepository.findByItemId(itemDto.getItemId()).orElseThrow(NullPointerException::new);

            item.setItemName(itemDto.getItemName());
            item.setItemDescription(itemDto.getItemDescription());
            item.setItemPrice(itemDto.getItemPrice());
            item.setItemDiscount(itemDto.getItemDiscount());
            item.setItemStock(itemDto.getItemStock());
            item.setCategoryDetail(categoryDetail);

            itemRepository.save(item);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteItem(Long itemId) {
        try {
            itemRepository.deleteByItemId(itemId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public ItemDto findOne(Long itemId) {
        Item item = itemRepository.findByItemId(itemId).orElseThrow(NullPointerException::new);
        ItemDto result = new ItemDto(item);
        return result;
    }

    @Override
    public HashMap<String, Object> findItemsByCategoryAndItemNameLike(ItemSearchReq itemSearchReq) {
        Slice<Item> items;

        if (itemSearchReq.getCategoryName().equals("전체")) {
            if(itemSearchReq.getItemName().equals("")) items = itemRepository.findByItemNameLike("%");
            else items = itemRepository.findByItemNameLike(itemSearchReq.getItemName());
        } else {
            if(itemSearchReq.getItemName().equals("")) {
                CategoryDetail categoryDetail = categoryDetailRepository.findByDetailName(itemSearchReq.getCategoryName());
                items = itemRepository.findByCategoryDetailAndItemNameLike(categoryDetail, "%");
            } else {
                CategoryDetail categoryDetail = categoryDetailRepository.findByDetailName(itemSearchReq.getCategoryName());
                items = itemRepository.findByCategoryDetailAndItemNameLike(categoryDetail, itemSearchReq.getItemName());
            }
        }

        List<ItemDto> itemList = items.getContent().stream()
                .map(i -> new ItemDto(i))
                .collect(toList());

        HashMap<String, Object> result = new HashMap<>();
        result.put("itemList", itemList);
        result.put("hasNextPage", items.hasNext());

        return result;
    }

    @Override
    public HashMap<String, Object> findItemsByStore(Long storeId) {
        Store store = storeRepository.findByStoreId(storeId).orElseThrow(NullPointerException::new);
        Slice<Item> items = itemRepository.findByStore(store);

        List<ItemDto> itemList = items.getContent().stream()
                .map(i -> new ItemDto(i))
                .collect(toList());

        HashMap<String, Object> result = new HashMap<>();
        result.put("itemList", itemList);
        result.put("hasNextPage", items.hasNext());

        return result;
    }

}
