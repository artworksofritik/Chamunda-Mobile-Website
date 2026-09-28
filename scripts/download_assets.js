const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = [
  {
    name: 'powerbank_studio.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1W0jiefWaLwDJT0OJkGH4roA_U3EuY93GWPvPi1sopwkkAHZ4VKNk9B17VcGAvhsMZtNOEIEI_61cYKQ31RQf7OGLH9EgU8SwSyRS6EqoM8PSJqXATUhq4Zvz309-tDf-X-wqZKACuiPKzBPVI5Mtk-X8NkkAWQ2MTwTVtrLwktfnS2ZGY-NHKdaBoGROEy719x-hp60zCUqR5waIoDZATWMxJumaljqc4BUD66nI1VV3788Pw_FKErIcY'
  },
  {
    name: 'magsafe_studio.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1XYLFoc0Rrh_wxUrgrYjCbE8-Txz9ssSrXOL4WQwzeP-KaO64mBztu_9f9lHY4nRVN-cb4dWpCVriQ3oYopqS6Ypd_FG7GHOJo_8gf_Xn4zwW22guoIMLZ8iN5yTBeIDCFSD4yyLJ6PbSFDlX86jESYkVvCCI75anqQmJnwknOUN6xhVC5vsh6UUSZVeYlkxQjaKFurCKb8qqkxa0LmPunqxFLwFbFXxk8PYYnZuOwRHSRQwBVVyq1XRQ'
  },
  {
    name: 'store_photo_1.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1VC8wMbLyXitgjWq9z6SqRt9ybAD9HUNzGefK6ZNKmKCIgVtFBIcuZ-32V-Xdlsw1ggBGcXxLMvt3tsP8F50uXcvDhckvaKsat4f07L08oqC0kYyFSJjcCWwaCh7lmKXV02aNMDZNHvCp3hFiYTO47uGY5cPm6ks1ezsfw9WB0I-lBHlixlsaeDfquiRvGHcGgw4G71HDrOlfkz8XGsMIsFmzOXXdZeQ1fxIbim_U4k3MPO76oF5DNmY9SCdtx0GXlch327avIvlg'
  },
  {
    name: 'store_photo_2.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1XSpg_70OH5W9BRNW6bMkC3c-I226RsymIShV9q5gTb1V92yEk3rwCtANaFcAH-z-l4Fh2WPulj9DVeqkKao-lc-qFuyyne5F-Fp-gQxeo9561GVq4mcoNyZ1zlUu2eSvoSkt1TbmYfBbYx26Y5wNCRl2uhDgVlwulSZ8Tx2XbeslFxy4Po60dsIV31UOy-zpzVw_-B1yAzsTI-KhProDNX2-Wqy3mrwXt-rpW9kEImEOtuoYFlKmwxvk1IoQkJ5ZmJOtJNDMc0'
  },
  {
    name: 'store_photo_3.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1WUjO_G0dGGrBITts_2Va2meVGcjDEqz3GN5IQ_dnBZmGbstXgq-vqhkSCY_soMSyNaRT_V9GVdVqJsl2muFCIWoxNNX5vFvqyrxJo0lDkSjrhitbRzVI2VW0SWl7OgJfCqT8isAEypTGw-rGwhedcV2BAdz7ZHBTiDbjHV7ycnPGFj7egQkIaadQ45jphQkLlt6EKylQpTpL1h59XmTPoiL046dF32T2FTj1Y-MW3Om-lLdNsb_sxp_3OadHWapQ286evFFzPG'
  },
  {
    name: 'store_photo_4.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1V_XE_lWcL2QSI5ugJV8OtTiyOLAeh5N2rgjyOgaTDx8ztA8V0nwPm_q6P6fPH6yxIwUDSJYxN5N2_WHVE0xgP3QNBYVRS_BmOjAdHND99x4p6BhEYCauHMr8OlvQuSPncgH2MLqpHfZUi_jTsnzdahQutki2-W01Hz_J5GAbK93cKxTX-_lHU5VO4rsqhYUImOkaq-9qYTmlFiaPzGuA8IBeZWifsc_K1djIR3SZSvv6gdNoV6yHdMGtjjs2mFc1up2solDFbfhQ'
  },
  {
    name: 'store_photo_5.jpg',
    url: 'https://lh3.googleusercontent.com/aida/AEtjO1Wkx7vBMsQgtsCIo7ewfHffgTOiiqdRCnwgUI61CINs3G1zE_eWe-iTvQqwEPaSa5VK8RbXAz9nDKnD3vycbiSInIIKQuKqPDKtkz_sJ0DEV2gLk-vF-IbL3ZuqjlKhGwN42drXpBF_niXHyY6ynWHSELElfQfzQqZfWZ2gJjKytnld7nfDA3D-wDoF86gDwU344kccZgtgwDybF6-rtyuQ8l3TvS2t2uHEkFFhoq9z3Q_RvYcbEcbeA9f2j7Azg4dC5d0pdjTHmA'
  }
];

const destDir = path.join(__dirname, '..', 'assets', 'images');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status code ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading assets...');
  for (const item of assets) {
    const dest = path.join(destDir, item.name);
    try {
      await downloadFile(item.url, dest);
      console.log(`Downloaded ${item.name} (${fs.statSync(dest).size} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
  console.log('Finished downloading assets.');
}

main();
