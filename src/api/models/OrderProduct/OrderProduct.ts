import {
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    Column
} from 'typeorm';
import { Product } from '../Product/Product';
import { Order } from '../Order/Order';

@Entity('order_product')
export class OrderProduct {

    @PrimaryColumn({ name: 'product_id', comment: 'Product table referece' })
    public productId: number;

    @PrimaryColumn({ name: 'order_id', comment: 'Order table referece' })
    public orderId: number;

    @Column({ type: 'int', nullable: false, comment: 'Order has Product quantity' })
    public quantity: number;

    @Column({ type: 'decimal', nullable: false, comment: 'Order has Product quantity' })
    public total: number;

    @ManyToOne(type => Product, product => product.orders)
    @JoinColumn({
        name: 'product_id',
    })
    public product: Product;

    @ManyToOne(type => Order, order => order.orderHasProduct)
    @JoinColumn({
        name: 'order_id',
    })
    public order: Order;
}
