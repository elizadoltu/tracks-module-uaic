import '../styles/header-page-style.css'

function HeaderPage() {

    return (
        <div>
            <h1 className="header-page">
                Hotel surroundings <img src="/hotel-surroundings.svg" alt="icon-hotel"/>
            </h1>
            <a href="http://google.com" className="link-map-header">Show map <img src="/travel-explorer.svg" alt="icon-hotel"/></a>
        </div>
    );
};

export default HeaderPage;