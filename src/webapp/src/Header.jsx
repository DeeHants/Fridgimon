function Header() {
    return (
        <header style={{
            height: "65px",
        }}>
            <div style={{
                position: "fixed",
                top: "0px",
                width: "100%",
                height: "65px",
                backgroundColor: "white",
            }}>
                <h1>
                    <img
                        src="../img/logo.png"
                        style={{
                            float: "left",
                            height: "36px",
                        }}
                    />
                    Fridgimon
                </h1>
            </div >
        </header >
    );
}
