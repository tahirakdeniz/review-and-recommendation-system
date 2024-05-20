import {Button, Form, Input, Rate} from 'antd';

const ReviewForm = () => {
    const onFinish = (values:any) => { // TODO replace any with the correct type
        console.log('Received values of form:', values);
        // Submit review logic here
    };

    return (
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please rate the product!' }]}>
                <Rate />
            </Form.Item>
            <Form.Item name="review" label="Review" rules={[{ required: true, message: 'Please add your review!' }]}>
                <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit Review
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ReviewForm;
