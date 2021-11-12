import { ApolloClient, InMemoryCache, gql, createHttpLink } from "@apollo/client";
import { Token, Pair } from "./interfaces";
import { setContext } from "@apollo/client/link/context";

export * from './interfaces';

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/query',
  });
  
const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `${token}` : ""
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

export async function getTokenSearchList(text: string = ""): Promise<Token[]> {
    let tokens = await client.query({
        query: gql`
            query {
                tokenSearch(prefix: "${text}") {
                    id,
                    name,
                    totalSupply,
                    iconURL,
                    price
                }
            }
        `
    });

    
    let results: Token[] = [];
    for(let token of tokens.data['tokenSearch']) {
        results.push({
            id: token['id'],
            name: token['name'],
            totalSupply: token['totalSupply'],
            iconURL: token['iconURL'],
            price: token['price']
        });
    }
    return results;
}

export async function getToken(id: string): Promise<Token> {
    return (
        await client.query({
            query: gql`
                query {
                    token(id: "${id}") {
                        id,
                        name,
                        totalSupply,
                        iconURL,
                        price
                    }
                }
            `
        })
    ).data['token']
}

export async function getTopTokens(pageId: number): Promise<Token[]> {
    return (
        await client.query({
            query: gql`
                query {
                    getTopMarketCapTokens(pageId: ${pageId}) {
                        id,
                        name,
                        totalSupply,
                        iconURL,
                        price
                    }
                }
            `,
            fetchPolicy: "no-cache"
        })
    ).data['getTopMarketCapTokens']
}

export async function login(username: string, password: string): Promise<boolean> {
    try {
        let authToken = await client.mutate({
            mutation: gql`
                mutation {
                    login(input: {
                        username: "${username}",
                        password: "${password}"
                    })
                }
            `
        });
        if (authToken.data == null) {
            return false;
        }
        localStorage.setItem("token", authToken.data['login']);
        return true;
    } catch(e) {
        alert("Wrong username or password")
        return false
    }
}

export async function signup(username: string, password: string): Promise<boolean> {
    try {
        let authToken = await client.mutate({
            mutation: gql`
                mutation {
                    createUser(input: {
                        username: "${username}",
                        password: "${password}"
                    })
                }
            `
        });
        if (authToken.data == null) {
            return false
        }
        localStorage.setItem("token", authToken.data['createUser']);
        return true;
    } catch(e) {
        alert(e);
        return false;
    }
}

export async function refereshToken(token: string): Promise<string> {
    try {
        let authToken = await client.mutate({
            mutation: gql`
                mutation {
                    refreshToken(input: {
                        token: "${token}"
                    })
                }
            `
        });
        return authToken.data['refreshToken'];
    } catch (e) {
        return "";
    }
}

export async function getExchangeRate(inToken: string, outToken: string, inAmount: number): Promise<number> {
    if (isNaN(inAmount)) return 0;
    let outAmount = await client.query({
        query: gql`
            query {
                getBestExchangeRate(inToken: "${inToken}", outToken: "${outToken}", inAmount: ${inAmount})
            }
        `
    });
    return outAmount.data["getBestExchangeRate"];
}

export async function getUserBalance(token: string): Promise<number> {
    try {
        let balanceResp = await client.query({
            query: gql`
                query {
                    getUserBalance(token: "${token}")
                }
            `,
            fetchPolicy: "no-cache"
        });
        return balanceResp.data['getUserBalance']
    } catch (e) {
        alert(e);
        return 0;
    }
}

export async function swap(inToken: string, outToken: string, inAmount: number): Promise<void> {
    try {
        let succeed = await client.mutate({
            mutation: gql`
                mutation {
                    swap(inToken: "${inToken}", outToken: "${outToken}", inAmount: ${inAmount})
                }
            `,
        })
        if (!succeed.data['swap']) {
            alert("Transcation rejected during the swap. User's balance preserved.")
        }
    } catch (e) {
        alert(e);
    }
}

export async function getTopTradedPair(pageId: number): Promise<Pair[]> {
    const resp = await client.query({
        query: gql`
            query {
                getTopTradedPair(pageId: ${pageId}) {
                    id,
                    icon0,
                    icon1,
                    token0,
                    token1,
                    marketCap,
                    totalVolumeRecorded
                }
            }
        `,
        fetchPolicy: "no-cache"
    });
    return resp.data['getTopTradedPair'];
}