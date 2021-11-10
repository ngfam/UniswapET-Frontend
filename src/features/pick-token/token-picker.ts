import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
    name: 'token',
    initialState: {
        tokens: [
            {
                name: 'ETH',
                id: 'ethereum',
                iconURL: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
                price: 4600
            },
            {
                name: 'BITCOIN',
                id: 'btc',
                iconURL: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
                price: 64000
            }
        ]
    },
    reducers: {
        updateToken: (state, action) => {
            state.tokens[action.payload['id']] = {
                name: action.payload['token']['name'],
                iconURL: action.payload['token']['iconURL'],
                price: action.payload['token']['price'],
                id: action.payload['token']['id']
            }
        }
    }
})

export const { updateToken } = tokenSlice.actions
export default tokenSlice.reducer;
