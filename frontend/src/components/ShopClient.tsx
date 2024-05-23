'use client';
import React, {useEffect, useState} from 'react';
import {Button, Card, Empty, Input, Select, Space, Spin} from 'antd';
import {useRouter, useSearchParams} from 'next/navigation'
import ShopCategory from "@/components/ShopCategory";
import axios from "axios";
import {baseURL} from "@/lib/const";
import {ProductDto} from "@/lib/dto";
import ShopCategoryRecommendedProducts from "@/components/ShopCategoryRecommendedProducts";
import {nameFormatter} from "@/lib/utils";

const splitCategories = (data: ProductDto[]): {name: string, products: ProductDto[]}[] => {
    const categories: {name: string, products: ProductDto[]}[] = [];
        data.forEach(product => {
            const category = categories.find(category => category.name === product.productCategoryName);
            if (category) {
                category.products.push(product);
            } else {
                categories.push({name: product.productCategoryName, products: [product]});
            }
        });
        return categories;
}

const ShopClient: React.FC = () => {
    const searchParams = useSearchParams();
    const [data, setData] = useState<{name: string, products: ProductDto[]}[]>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState<string >("");
    const router = useRouter();
    const search = searchParams.get('search');
    const category = searchParams.get('category');

    useEffect(() => {

        setSelectedCategory(category);
        setSearchInput(search || "");

        const fetchProducts = async () => {
            setLoading(true);
            console.log(search, category)
            const queryParams = new URLSearchParams();

            if(search && search.length > 0) {
                queryParams.append('searchKey', search);
            }

            if(category) {
                queryParams.append('category', category);
            }

            try {
                const response = await axios.get(`${baseURL}/products/get?${queryParams.toString()}`);
                if (response.status === 200) {
                    setData(splitCategories(response.data as ProductDto[]));
                }
                else {
                    setError("Failed to fetch products");
                }
            }
            catch (e) {
                setError("Failed to fetch products");
                console.error(e)
            }
            setLoading(false);
        }

        fetchProducts();
    }, [searchParams]);

    if(loading) {
        return <Spin fullscreen/>
    }

    if(error) {
        return <div>{error}</div>
    }

    if(!data || data.length === 0) {

        return <Card> <Empty/> </Card>
    }

    function handleSearchButton() {
        const queryParams = new URLSearchParams();

        if(searchInput && searchInput.length > 0) {
            queryParams.append('search', searchInput);
        }

        if(selectedCategory) {
            queryParams.append('category', selectedCategory);
        }

        const url = `/shop?${queryParams.toString()}`;

        router.push(url);

    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <Card>
                <Space>
                    <Input
                        value={searchInput}
                        placeholder={"Search..."}
                        onChange={(e) => setSearchInput(e.target.value)}/>
                    <Select
                        showSearch
                        placeholder={"Select Category"}
                        style={{ width: 200 }}
                        allowClear
                        options={data.map(category => ({label: nameFormatter(category.name), value: category.name}))}
                        value={selectedCategory}
                        onChange={(value) => {setSelectedCategory(value)}}
                    />
                    <Button type={"primary"} onClick={handleSearchButton}>Search</Button>
                </Space>

            </Card>
            {(!search && !category && localStorage.getItem('accessToken') != null) && <ShopCategoryRecommendedProducts/>}
            {data?.map(categoryItem => {
                const showFull = !!((category && category === categoryItem.name) || (search));
                const showCategory = !category || category === categoryItem.name;

                if (!showCategory) return null;

                return (
                    <ShopCategory
                        key={categoryItem.name}
                        title={nameFormatter(categoryItem.name)}
                        data={categoryItem.products}
                        full={showFull}
                        categoryName={categoryItem.name}
                    />
                );
            })}
        </div>
    );
};

export default ShopClient;