'use client';

import {ProductSearchBar} from "@/components/ProductSearchBar";
import {Col, Row, Space} from "antd";
import ProductBrowseBy from "@/components/ProductBrowseBy";
import ProductBrowseSection from "@/components/ProductBrowseSection";
import {ProductCarousel} from "@/components/ProductCarousel";

export default function Products() {
    return (
        <Space direction={"vertical"} size={'large'} className={'flex'}>
            <ProductBrowseSection/>
            <ProductCarousel/>
        </Space>
    );
}