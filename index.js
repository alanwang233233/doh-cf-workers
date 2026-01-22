const doh = 'https://security.cloudflare-dns.com/dns-query'
const dohjson = 'https://security.cloudflare-dns.com/dns-query'
const contype = 'application/dns-message'
const jstontype = 'application/dns-json'
const path = '/v1/dns-query/gv645g64g6r54b654v64feg6h'; // default allow all, must start with '/' if specified, eg. "/dns-query"

export default {
    async fetch(r, env, ctx) {
        return handleRequest(r);
    },
};

async function handleRequest(request) {
    const r404 = new Response("Not Found", {status: 404});
    let res = r404;
    const { method, headers, url } = request
    const {searchParams, pathname} = new URL(url)
    
    // Check path
    if (!pathname.startsWith(path)) {
        return r404;
    }
    if (method == 'GET' && searchParams.has('dns')) {
        res = fetch(doh + '?dns=' + searchParams.get('dns'), {
            method: 'GET',
            headers: {
                'Accept': contype,
            }
        });
    } else if (method === 'POST' && headers.get('content-type') === contype) {
        // streaming out the request body is optimal than awaiting on it
        const rostream = request.body;
        res = fetch(doh, {
            method: 'POST',
            headers: {
                'Accept': contype,
                'Content-Type': contype,
            },
            body: rostream,
        });
    } else if (method === 'GET' && headers.get('Accept') === jstontype) {
        const search = new URL(url).search
        res = fetch(dohjson + search, {
            method: 'GET',
            headers: {
                'Accept': jstontype,
            }
        });
    }
    return res;
}
