package com.ssafy.fcmus.entity.live;


import com.ssafy.fcmus.entity.store.Item;
import com.ssafy.fcmus.entity.store.Store;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "live")
public class Live {

    //필드
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "live_id", unique = true, nullable = false)
    private Long live_id;

    @Column(nullable = false)
    private Integer live_discount;

    @Column
    private Integer live_viewers;

    @Column
    private LocalDateTime live_start;

    @Column
    private LocalDateTime live_end;

    // 연결

    @OneToOne
    @JoinColumn(name="item_id")
    private Item item;

    @OneToOne
    @JoinColumn(name="store_id")
    private Store store;

    @OneToMany(mappedBy = "live")
    private List<LiveLike> liveLike = new ArrayList<>();

    //빌더
    @Builder
    public Live(Long live_id,Integer live_discount, Integer live_views, LocalDateTime live_start, LocalDateTime live_end ) {
        this.live_id = live_id;
        this.live_start = live_start;
        this.live_end = live_end;
        this.live_discount = live_discount;
        this.live_viewers = live_views;

    }
}