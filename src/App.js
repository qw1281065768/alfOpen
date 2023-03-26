import { ThemeProvider } from "styled-components";
import { Light } from "./styles/Themes";
import GLobalStyles from "./styles/GlobalStyles";

import Navbar from "./components/Navbar";
import Home from "./components/sections/Home";
import About from "./components/sections/About";
import Roadmap from "./components/sections/Roadmap";
import Showcase from "./components/sections/Showcase";
import Team from "./components/sections/Team";
import Faqs from "./components/sections/Faqs";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import React from "react";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: {},
      web3: {},
      account: {},
      count: 1,
      proof: "", // whiteListKey
      mintType: "",
      mintTransaction: "",
      pendingRequest: false,
      connected: false,
      txn: "",
      finish: false,
      mintedNum: 0,
      mintableNum: -1,
      tier: 0,
      address: "",
      containedModalShow: "",
      modalDialogTitle: "",
      modalDialogBodyText: "",
      modalDialogBodyHref: "",
      mintErrorMsg: "",
    };
    this.web3Modal = {};
  }
  render() {
    return (
      <>
        <GLobalStyles />
        <ThemeProvider theme={Light}>
          <Navbar data={this} />
          <Home data={this}/>
          <About />
          {/*<Roadmap />
          <Showcase />
          <Team />
          <Faqs />
          */}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </>
    );
  }
}

export default App;
