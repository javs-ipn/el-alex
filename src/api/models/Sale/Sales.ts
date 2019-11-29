import {
    Column,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

@Entity('sales')
export class Sales {

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'order_id' })
    public orderId: number;

    @Column({ name: 'total' })
    public total: number;

}
