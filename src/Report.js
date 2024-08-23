const Report = ({ data }) => {
    return (
        <div style={{ fontSize: '16px', alignContent: 'flex-start', margin: '0px auto', width: "80%", overflowY: "scroll" }}>
            <h1>Report</h1>
            <p>Status: {data.status}</p>
            <p>Reason: {data.reason}</p>
            <p>Report: {data.report}</p>


            <div style={{ display: 'flex', alignItems: 'left ', margin: '50px' }}>
                <h2>Media</h2>
                
                <div style={{ display: 'flex', width: "80%", overflowX: "scroll" }}>

                    {data.media.map((media, index) => (

                        <MediaItem key={index} uri={media.uri} name={media.name} date={media.date} />
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'left ', margin: '50px' }}>

                <h2>Social Images:</h2>
                <div style={{ display: 'flex', width: "800px", overflowX: "scroll" }}>
                    {data?.social_images?.map((socialImage, index) => (
                        <SocialImage key={index} uri={socialImage.uri} platform={socialImage.platform} name={socialImage.name} date={socialImage.date} />
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'left ', margin: '50px' }}>

                <h2>Social Descriptions:</h2>
                <div style={{ alignItems: 'left', textAlign: 'left' }}>
                    {data?.social_descriptions?.map((socialDescription, index) => (
                        <div key={index}>
                            <h4>{socialDescription.platform}</h4>
                            <p>{socialDescription.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ alignItems: 'left', textAlign: 'left', margin: '50px' }}>
                <h2>Video Items:</h2>
                {
                    data?.video_items?.map((videoItem, index) => (
                        <VideoItem key={index} uri={videoItem.uri} name={videoItem.name} date={videoItem.date} />
                    ))
                }
            </div>
        </div >
    );
};
const MediaItem = ({ uri, name, date }) => {
    return (
        <div style={{ alignItems: 'left', textAlign: 'left', paddingLeft: '10px' }}>
            <img src={uri} alt={name} width="100" height="100" />
            {/* <h4>{name}</h4> */}
            {/* <p>{date}</p> */}
        </div>
    );
};
const SocialImage = ({ uri, platform, name, date }) => {
    return (
        <div style={{ alignItems: 'left', textAlign: 'left', paddingLeft: '10px' }}>
            <img src={uri} alt={name} width="100" height="100" />
            {/* <h4>{name}</h4> */}
            <p>{platform}</p>
            {/* <p>{date}</p> */}
        </div>
    );
};
const VideoItem = ({ uri, name, date }) => {
    return (
        <div>
            <video src={uri} width="250" height="250" controls />
            {/* <h4>{name}</h4> */}
            {/* <p>{date}</p> */}
        </div>
    );
};
export default Report;