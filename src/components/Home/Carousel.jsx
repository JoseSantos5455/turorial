import React, { useRef } from 'react';
import { Carousel, Button, ConfigProvider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const CarouselCustom = () => {
    const carouselRef = useRef(null); // Tạo ref để điều khiển Carousel

    const contentStyle = {
        height: '300px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };

    return (
        <div className='relative w-full '>
            <ConfigProvider
                theme={{
                    components: {
                        Carousel: {
                            dotWidth: 20,
                            dotHeight: 5,
                            dotActiveWidth: 30,
                            dotActiveHeight: 20,

                        },
                    },
                }}
            >
                <Carousel
                autoplaySpeed={10000}
                    autoplay
                    dots={true}
                    ref={carouselRef}
                    dotPosition='bottom'
                    infinite={true}
                >
                    <div>
                        <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                        <h3 style={contentStyle}>4</h3>
                    </div>
                </Carousel>
            </ConfigProvider>


            {/* Nút trái */}
            <Button
                type="default"
                shape="circle"
                icon={<LeftOutlined />}
                onClick={() => carouselRef.current.prev()}
                style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }}
            />
            {/* Nút phải */}
            <Button
                type="default"
                shape="circle"
                icon={<RightOutlined />}
                onClick={() => carouselRef.current.next()}
                style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
            />
        </div>
    );
};

export default CarouselCustom;
