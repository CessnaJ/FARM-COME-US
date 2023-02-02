package com.ssafy.farmcu.api.service.store;

import com.ssafy.farmcu.api.dto.store.StoreDto;
import com.ssafy.farmcu.api.entity.member.Member;
import com.ssafy.farmcu.api.entity.store.Store;
import com.ssafy.farmcu.api.repository.MemberRepository;
import com.ssafy.farmcu.api.repository.StoreRepository;
import com.ssafy.farmcu.exception.NotFoundUserException;
import com.ssafy.farmcu.exception.NotFoundStoreException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * ### Service method
 * - find
 * - save ex) saveItem
 * - delete
 * - update
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StoreServiceImpl implements StoreService{

    private final StoreRepository storeRepository;
    private final MemberRepository memberRepository;

    @Transactional// 스토어 생성 save service
    public boolean saveStore(StoreDto storeDto, String id){
        try {
            Member member = memberRepository.findById(id).orElseThrow(() -> new NotFoundUserException("아이디를 가진 사람이 없습니다."));
            Store store = Store.builder()
                    .storeDeliveryCost(storeDto.getStoreDeliveryCost())
                    .storeDeliveryFree(storeDto.getStoreDeliveryFree())
                    .storeDescription(storeDto.getStoreDescription())
                    .storeDetailAddr(storeDto.getStoreDetailAddr())
                    .storeImg(storeDto.getStoreImg())
                    .storePhoneNumber(storeDto.getStorePhoneNumber())
                    .storeStreetAddr(storeDto.getStoreStreetAddr())
                    .storeZipcode(storeDto.getStoreZipcode())
                    .storeName(storeDto.getStoreName())
                    .member(member)
                    .build();
            storeRepository.save(store);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public StoreDto findStore(Long storeId){ // 스토어 정보 찾아오기
        Store store = storeRepository.findByStoreId(storeId).orElseThrow(()-> new NotFoundStoreException("스토어가 존재하지 않음"));

        try {
            StoreDto finded = StoreDto.builder()
                    .storeDeliveryCost(store.getStoreDeliveryCost())
                    .storeLike(store.getStoreLike())
                    .storeName(store.getStoreName())
                    .storeZipcode(store.getStoreZipcode())
                    .storeDeliveryFree(store.getStoreDeliveryFree())
                    .storeDescription(store.getStoreDescription())
                    .storeDetailAddr(store.getStoreDetailAddr())
                    .storeImg(store.getStoreImg())
                    .storePhoneNumber(store.getStorePhoneNumber())
                    .storeStreetAddr(store.getStoreStreetAddr())
                    .build();
            return finded;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public boolean updateStore(Long storeId, StoreDto storeDto){ // 스토어 정보 수정
        Store store = storeRepository.findByStoreId(storeId).orElseThrow(()-> new NotFoundStoreException("스토어가 존재하지 않음"));

        try{
            Store update = Store.builder()
                    .storeId(storeId)
                    .storeDeliveryCost(storeDto.getStoreDeliveryCost())
                    .storeDeliveryFree(storeDto.getStoreDeliveryFree())
                    .storeDescription(storeDto.getStoreDescription())
                    .storeDetailAddr(storeDto.getStoreDetailAddr())
                    .storeImg(storeDto.getStoreImg())
                    .storePhoneNumber(storeDto.getStorePhoneNumber())
                    .storeStreetAddr(storeDto.getStoreStreetAddr())
                    .storeZipcode(storeDto.getStoreZipcode())
                    .storeName(storeDto.getStoreName())
                    .build();

            storeRepository.save(update);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public boolean deleteStore(Long storeId){
        Store store = storeRepository.findByStoreId(storeId).orElseThrow(()-> new NotFoundStoreException("스토어가 존재하지 않음"));

        try{
            storeRepository.delete(store);
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }

}