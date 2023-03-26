import React from "react";
import { MintTransaction } from "../../utils/mint";
import styles from "./box.module.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { MAX_AMOUNT, OPENSEA_URL, MAX_BATCH_SIZE } from "../../utils/configuration";
import { Button } from "@mui/material";

import TextField, {TextFieldChangeEvent} from '@mui/material/TextField'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';

const theme = createTheme({
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#0f1010',
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const MintBox = ({ data }) => {
  const [amount, setAmount] = React.useState('1');
  const handleChange = (event: SelectChangeEvent) => {
    setAmount(event.target.value);
    data.setState({
      count: parseInt(event.target.value)
    })
  };
  const handleChange1 = (event: TextFieldChangeEvent) => {  
    console.log(event.target.value)
    data.setState({
      proof: event.target.value
    })
  };
  
  const menuList = Array.from({ length: MAX_BATCH_SIZE }, (_, i) => i + 1);
  return (
    <div className={styles.boxWrapper}>
      {(data.state.mintedNum >= MAX_AMOUNT) ? (
        <div className={styles.boxWrapperTop}>
          <p>
            Sold out!
            <a href={OPENSEA_URL}>
              <span>Opensea</span>{" "}
            </a>{" "}
          </p>
        </div>)
        :
        (<div className={styles.boxWrapperTop}>
          <div className={styles.boxWrapperTopContent}>
            <Box sx={{ minWidth: 90 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label"></InputLabel>
                <Select
                  value={amount}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  {menuList.map((item, i) => {
                    return (<MenuItem value={item}>{item}</MenuItem>);
                  })}
                </Select>
              </FormControl>
            </Box>
            <Button variant="contained" theme={theme} disabled={!data.state.connected} onClick={() => {
              console.log("MINT DATA", data);
              MintTransaction(data);
              data.setState({
                containedModalShow: true,
                modalDialogBodyText: `支付中，mint数量为： ${data.state.count}`
              })
            }}> Mint</Button>

          </div>
          <TextField 
              id="outlined-basic" 
              label="WhiteKey" 
              variant="outlined"
              disabled={!data.state.connected}
              onChange={handleChange1}
              />
          {/*<p>{data.state.mintedNum}/{MAX_AMOUNT} Minted</p>*/}
        </div>)}
    </div>
  );
};

export default MintBox;