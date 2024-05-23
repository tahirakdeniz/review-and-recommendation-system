import styled from "styled-components";
import {Button, Card} from "antd";

export const StyledButton = styled(Button)`
    margin: 0 5px;
`;
export const StyledCard = styled(Card)`
    width: 100%;
    text-align: center;
    border-radius: 10px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
        transform: scale(1.03);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
`;
export const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    overflow: hidden;
`;