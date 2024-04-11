import Navbar from '../components/layout/Navbar';
import FeaturedCarousel from '../components/Careousel/FeaturedCarousel';
import TopReviews from '../components/TopReviews';
import Recommendations from '../components/Recommendations';
import CarouselContainer from "@/components/Careousel/CarouselContainer";

export default function Home() {
    return (
        <div>
            <FeaturedCarousel/>
            <TopReviews/>
            <Recommendations/>
        </div>
    );
}
