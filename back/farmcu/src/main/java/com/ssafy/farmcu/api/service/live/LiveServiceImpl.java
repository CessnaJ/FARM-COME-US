package com.ssafy.farmcu.api.service.live;

import com.ssafy.farmcu.api.dto.live.LiveDetailRes;
import com.ssafy.farmcu.api.dto.live.LiveInsertReq;
import com.ssafy.farmcu.api.dto.live.LiveListRes;
import com.ssafy.farmcu.api.entity.live.Live;
import com.ssafy.farmcu.api.entity.store.Item;
import com.ssafy.farmcu.api.entity.store.Store;
import com.ssafy.farmcu.api.repository.ItemRepository;
import com.ssafy.farmcu.api.repository.LiveRepository;
import com.ssafy.farmcu.api.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class LiveServiceImpl implements LiveService {

    private final ItemRepository itemRepository;
    private final StoreRepository storeRepository;
    private final LiveRepository liveRepository;

    @Override
    public boolean saveLive(LiveInsertReq liveInsertReq) {
        try {
            Item item = itemRepository.findByItemId(liveInsertReq.getItemId()).orElseThrow(NullPointerException::new);
            Store store = storeRepository.findByStoreId(liveInsertReq.getStoreId()).orElseThrow(NullPointerException::new);
            Live live = Live.builder()
                    .liveTitle(liveInsertReq.getLiveTitle())
                    .liveDiscount(liveInsertReq.getLiveDiscount())
                    .liveStock(liveInsertReq.getLiveStock())
                    .liveStart(LocalDateTime.parse(liveInsertReq.getLiveStart()))
                    .item(item)
                    .store(store)
                    .build();

            liveRepository.save(live);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<LiveListRes> findItemsByLiveTitleLike(String liveTitle) {
        List<Live> lives = liveRepository.findByLiveTitleLike(liveTitle);
        List<LiveListRes> result = lives.stream()
                .map(l -> new LiveListRes(l))
                .collect(toList());

        return result;
    }

    @Override
    public LiveDetailRes findOne(Long liveId) {
        Live live = liveRepository.findByLiveId(liveId).orElseThrow(NullPointerException::new);

        LiveDetailRes result = new LiveDetailRes(live);
        return result;
    }

    @Override
    public boolean updateLive(LiveInsertReq liveInsertReq) {
        try {
            Live live = liveRepository.findByLiveId(liveInsertReq.getLiveId()).get();
            live.setLiveTitle(liveInsertReq.getLiveTitle());
            live.setLiveStart(LocalDateTime.parse(liveInsertReq.getLiveStart()));
            live.setLiveDiscount(liveInsertReq.getLiveDiscount());
            live.setLiveStock(liveInsertReq.getLiveStock());

            liveRepository.save(live);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteLive(Long liveId) {
        try {
            liveRepository.deleteByLiveId(liveId);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

}
