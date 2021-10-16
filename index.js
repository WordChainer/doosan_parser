const { promisify } = require('util');
const prompt = require('prompt-sync')();
const request = promisify(require('request'));
const cheerio = require('cheerio');
const fs = require('fs');
const indexes = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const URL = prompt('URL 주소: ').replace(/&index=.+$/, '') + '&index=';

async function main() {
    let words = [];

    for (let i = 0, len = indexes.length; i < len; i++) {
        let promises = [],
            index = indexes[i],
            maxPage = Math.ceil((await getCount(index)) / 15);

        for (let page = 1; page <= maxPage; page++) {
            promises.push(getWords(words, index, page));
        }

        Promise
            .all(promises)
            .then(() => {
                console.log(index + ' 파싱 완료');

                if (index === 'ㅎ') {
                    fs.writeFileSync(`result.txt`, words.join('\r\n'));
                }
            });
    }
}

async function getWords(words, index, page) {
    let url = URL + encodeURIComponent(index) + '&page=' + page,
        { body } = await request(url),
        $ = cheerio.load(body);

    $('.subject .title a:first-child').each((i, el) => words.push($(el).text())); 

    console.log('누적: ' + words.length);
}

async function getCount(index) {
    let url = URL + encodeURIComponent(index) + '&page=1',
        { body } = await request(url),
        $ = cheerio.load(body),
        count = +$('#content > div.path_area > em').text().replace(/\D/g, '');

    return count;
}

main();