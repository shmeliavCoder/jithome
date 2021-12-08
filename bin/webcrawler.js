const qs = require("qs")
const cheerio = require('cheerio');


axios({
    method: 'get',
    url: url,
    data: qs.stringify({
        "q": "language:JavaScript"
    }),
    headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
})
// axios.get("https://github.com/trending", {
//     headers: {
//         'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
//     }
// })
    .then(res => {
        console.log('queried data');
        const $ = cheerio.load(res.data);

        console.log($('title').text());

        const topRepoUrls = []

        $('.h3 > a').each(function (i, elem) {
            topRepoUrls.push($(this).attr("href"));
        })

        const topNRepos = topRepoUrls.slice(0, options.number)
            .map(url => ({
                url: url,
                author: url.split('/')[1],
                package: url.split('/')[2],
                packageJsonUrl: `https://raw.githubusercontent.com${url}/main/package.json`
            }))
        // UP TO HERE IS MY OWN WEB CRAWLING EXPERIENCE
        
        // const topNReposPackageFilePromises = topNRepos
        //     .map(async (repo) => {
        //         try {
        //             const res = await axios.get(repo.packageJsonUrl)
        //             return { ...repo, packageJsonLob: res.data }
        //         }
        //         catch (ex) {
        //             console.log(`couldn't query the package.json for ${repo.packageJsonUrl}`)
        //             return { ...repo, packageJsonLob: null }
        //         }
        //     })

        // Promise.all(topNReposPackageFilePromises).then(data => 
        //     { 
        //         console.log(data) 

        //         const results = []

        //         data.forEach(item => {
        //             if(item.packageJsonLob !== null) {
        //                 // check with cli "dependency-check"
        //                 const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

        //                 exec(`npm i -g ${kebabize(item.package)}`, (error, stdout, stderr) => {
        //                     if (error) {
        //                         console.log(`error: ${error.message}`);
        //                         return;
        //                     }
        //                     if (stderr) {


        //                         console.log(`stderr: ${stderr}`);
        //                         return;
        //                     }
        //                     console.log(`stdout: ${stdout}`);


        //                     exec(`dependency-check -entry=C:\\Users\\Eliav\\AppData\\Roaming\\npm\\node_modules\\${kebabize(item.package)}\\package.json`, (error, stdout, stderr) => {
        //                         if (error) {
        //                             console.log(`error: ${error.message}`);
        //                             return;
        //                         }
        //                         if (stderr) {

        //                             console.log(`stderr: ${stderr}`);
        //                             return;
        //                         }
        //                         console.log(`stdout: ${stdout}`);
        //                     })
        //                 })
        //             }
        //         })
        //     })

        // console.log(topNReposWithIndexFile)
    })
    .catch(err => {
        console.log(err)
    });