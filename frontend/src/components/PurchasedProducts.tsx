import { useState } from 'react';
import { Card, List, Typography, Space, Row, Col, Divider, Avatar, Empty, Pagination } from 'antd';
import { ProductDto } from '@/lib/dto';
import {User} from "@/lib/redux/features/user/userSlice";
import PurchasedProductItem from "@/components/PurchasedProductItem"; // Make sure this import matches your type definitions

const { Text, Title } = Typography;

export default function PurchasedProducts({ user }: { user: User }) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    const nonEmptyPurchases = user.purchaseDtos.filter(purchase => purchase.purchaseItemDtoList.length > 0);
    const paginatedPurchases = nonEmptyPurchases.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <Card
            title={<Title level={3}>Purchased Products</Title>}
            style={{ maxWidth: 1500, width: '100%', marginTop: '20px', padding: '20px' }}
            bodyStyle={{ padding: 0 }}
        >
            {user.purchaseDtos.length > 0 ? (
                <>
                    <List
                        dataSource={paginatedPurchases}
                        renderItem={(purchase) => (
                            <List.Item key={purchase.id} style={{ padding: '20px' }}>
                                <Card
                                    title={`Purchase ${new Date(purchase.purchaseDate).toLocaleDateString()}`}
                                    extra={<Text>Total Cost: ${purchase.totalCost.toFixed(2)}</Text>}
                                    style={{ width: '100%' }}
                                    bodyStyle={{ padding: '10px' }}
                                >
                                    <List
                                        dataSource={purchase.purchaseItemDtoList}
                                        renderItem={item => (
                                            <PurchasedProductItem item={item} />
                                        )}
                                    />
                                </Card>
                            </List.Item>
                        )}
                    />
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={user.purchaseDtos.length}
                        onChange={handlePageChange}
                        style={{ textAlign: 'center', marginTop: '20px' }}
                    />
                </>
            ) : (
                <Empty description="No purchased products found" />
            )}
        </Card>
    );
}
