import {Steps} from "antd";

export default function SignupStepper({current} : {current: number}){
    const steps = [
        {
            title: 'Step 1',
        },
        {
            title: 'Step 2',
        },
        {
            title: 'Step 3',
        },
    ];

    if(current < 0 || current > steps.length){
        return null;
    }

    return (
        <Steps
            size="small"
            current={current}
            items={steps}
        />
    );
}