const COLLECTION_ID = 'library';
const title = document.querySelector('#review-title');
const content = document.querySelector('#editor');
const submit = document.querySelector('#review-submit');
const formFile = document.querySelector('#formFile');

var quill;

function loadReview() {
    db.collection(COLLECTION_ID)
        .doc('review').get()
        .then((doc) => {
            let review = doc.data();
            title.value = review.title;
            content.innerHTML = review.content;
            if (review.cover) {
                preview.src = review.cover;
            }

            quill = new Quill('#editor', {
                theme: 'snow'
            });
        });
}

var image;

function saveReview() {
    if (formFile.files.length > 0) {
        storage.ref().child('review')
            .put(formFile.files[0])
            .then((file) => file.ref.getDownloadURL())
            .then((url) => db.collection(COLLECTION_ID)
                .doc('review')
                .set({
                    title: title.value,
                    content: quill.root.innerHTML,
                    cover: url
                })
            )
            .then(() => {
                alert('Success');
            });
    } else {
        db.collection(COLLECTION_ID)
            .doc('review')
            .set({
                title: title.value,
                content: quill.root.innerHTML,
            })
            .then(() => {
                alert('Success');
            });
    }

}

window.onload = () => {
    submit.onclick = saveReview;
    loadReview();
}