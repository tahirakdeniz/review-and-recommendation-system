import {Carousel, CarouselProps} from "antd";
import {CustomArrowProps} from "@ant-design/react-slick";

type CustomCarouselProps = {
    children: React.ReactNode;
    settings?: CarouselProps;
}

function SampleNextArrow(props: CustomArrowProps){
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "red" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props : CustomArrowProps) {
    const { className, style, onClick } = props;

    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "green" }}
            onClick={onClick}
        />
    );
}

const CustomCarousel = ({children, settings} : CustomCarouselProps) => {
    return (
        <Carousel {...settings} prevArrow={<SamplePrevArrow />} nextArrow={<SampleNextArrow/>}>
            {children}
        </Carousel>
    );
}
export default CustomCarousel;