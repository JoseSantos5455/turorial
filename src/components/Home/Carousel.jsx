import React, { useRef } from 'react';
import { Carousel, Button, ConfigProvider } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const CarouselCustom = () => {
    const carouselRef = useRef(null);

    const contentStyle = {
        height: '300px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        borderRadius: '17px',
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
                        {/* <h3 style={{ ...contentStyle, background: 'linear-gradient(to right, #890aff, #7a4ffa, #6c75fa, #5aa4fa)' }}>1</h3> */}
                        <img src="https://cdn.leonardo.ai/users/5afdf13a-2dff-4bc5-a46a-48f00c710324/generations/2a35753a-880e-4183-b7d4-c33626cc3e3e/Leonardo_Kino_XL_image_Introducing_a_website_selling_Vietnames_3.jpg" alt="carousel" style={{ width: '100%', height: '400px', borderRadius: '17px' }} />
                    </div>
                    <div>
                        {/* <h3 style={{ ...contentStyle, background: 'linear-gradient(to right, #fe215d, #fe4b3c, #ff5d2e, #fe8f05)' }}>2</h3> */}
                        <img src="https://cdn.leonardo.ai/users/5afdf13a-2dff-4bc5-a46a-48f00c710324/generations/2a35753a-880e-4183-b7d4-c33626cc3e3e/Leonardo_Kino_XL_image_Introducing_a_website_selling_Vietnames_2.jpg" alt="carousel" style={{ width: '100%', height: '400px', borderRadius: '17px' }} />

                    </div>
                    <div>
                        {/* <h3 style={{ ...contentStyle, background: 'linear-gradient(to right, #6a2af9, #9b59dc, #d08dbe, #fab5a7)' }}>3</h3> */}
                        <img src="https://cdn.leonardo.ai/users/5afdf13a-2dff-4bc5-a46a-48f00c710324/generations/2a35753a-880e-4183-b7d4-c33626cc3e3e/Leonardo_Kino_XL_image_Introducing_a_website_selling_Vietnames_0.jpg" alt="carousel" style={{ width: '100%', height: '400px', borderRadius: '17px' }} />

                    </div>
                    <div>
                        {/* <h3 style={{ ...contentStyle, background: 'linear-gradient(to right, #2975f9, #5138dd, #6619ce)' }}>4</h3> */}
                        <img src="https://cdn.leonardo.ai/users/5afdf13a-2dff-4bc5-a46a-48f00c710324/generations/3ab014af-c1cc-4738-b875-fd69f1dace72/Leonardo_Kino_XL_image_Introducing_a_website_selling_Vietnames_3.jpg" alt="carousel" style={{ width: '100%', height: '400px', borderRadius: '17px' }} />

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
