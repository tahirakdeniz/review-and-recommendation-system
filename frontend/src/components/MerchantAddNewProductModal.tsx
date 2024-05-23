import {useSelector} from "react-redux";
import {RootState, useDispatch} from "@/lib/redux/store";
import {useState} from "react";
import {addProduct, Product, setNewModalOpen} from "@/lib/redux/features/productManagment/productManagmentSlice";
import {Input, message, Modal, Space} from "antd";
import {MerchantProductCategorySelect} from "@/components/MerchantProductCategory";
import TextArea from "antd/es/input/TextArea";

export const MerchantAddNewProductModal = () => {
    const isNewModalOpen = useSelector((state: RootState) => state.products.isNewModalOpen);
    const dispatch = useDispatch();
    const [product, setProduct] = useState<Product>()
    const [messageApi, contextHolder] = message.useMessage();

    const addNewProduct = async () => {
        if (product) {
            const res = await dispatch(addProduct(product))
            if (res.meta.requestStatus == "fulfilled") {
                messageApi.success("Product Added Successfully");
                dispatch(setNewModalOpen(false));
                setProduct(undefined);
            }
        }
        else {
            messageApi.error("Product data is invalid")
        }
    }

    const handleCancel = () => {
        dispatch(setNewModalOpen(false))
        setProduct(undefined);
    }

    return (
        <Modal title={"Add New Product"} open={isNewModalOpen} onOk={addNewProduct} onCancel={handleCancel}>
            {contextHolder}
            <Space direction="vertical" style={{width: '100%'}}>
                <Input
                    placeholder="Product Name"
                    value={product?.name}
                    onChange={(e) => setProduct({...product!, name: e.target.value})}
                />
                <MerchantProductCategorySelect
                    onChange={(value) => setProduct({...product!, productCategoryName: value})}
                    value={product?.productCategoryName}
                />
                <Input
                    prefix="$"
                    placeholder="Price"
                    type="number"
                    value={product?.price}
                    onChange={(e) => setProduct({...product!, price: parseInt(e.target.value, 10) || 0})}
                />
                <TextArea
                    rows={4}
                    placeholder="Product Description"
                    value={product?.description}
                    onChange={(e) => setProduct({...product!, description: e.target.value})}
                />
            </Space>
        </Modal>
    )
}