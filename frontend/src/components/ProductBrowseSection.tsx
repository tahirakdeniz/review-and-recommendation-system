import {Col, Row} from "antd";
import {ProductSearchBar} from "@/components/ProductSearchBar";
import ProductBrowseBy from "@/components/ProductBrowseBy";

export default function ProductBrowseSection() {
    return (
        <div style={{padding: '20px', textAlign: 'center'}}>
            <Row gutter={16} style={{marginBottom: '20px'}}>
                <Col span={8} offset={8}>
                    <ProductBrowseBy/>
                </Col>
                <Col span={8}>
                    <ProductSearchBar/>
                </Col>
            </Row>
        </div>
    );
}