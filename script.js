var trainees = [];
var users = {};

function loadDB() {
    db.collection("trainees")
        .doc("athena")
        .get()
        .then(doc => {
            users = doc.data().users;
            trainees = Object.keys(users).sort().map((id) => {
                users[id].birthday = moment(new Date(1000 * users[id].birthday.seconds)).format('DD MMMM YYYY');
                users[id].createdAt = moment(new Date(1000 * users[id].createdAt.seconds)).format('DD MMMM YYYY');
                users[id].skills = users[id].skills.join('\n\n');
                return users[id];
            });
            dumpToExcel(trainees);
        });
}

function dumpToExcel(trainees) {
    let workbook = XLSX.utils.book_new();
    workbook.Props = {
        Title: "Athena's Cabin",
        Subject: "Trainees Database",
        Author: "Athenians",
        CreatedDate: new Date()
    };

    workbook.SheetNames.push("Rents");
    let header = {
        id: 'ID',
        fullName: 'Full Name',
        username: 'Username',
        faceClaim: 'Face Claim',
        birthday: 'Birthday',
        birthplace: 'Birthplace',
        hobby: 'Hobby',
        specialty: 'Specialty',
        funFact: 'Fun Facts',
        skills: 'Skills',
        createdAt: 'Created At'
    };
    let withHeader = [header].concat(trainees);
    var worksheet = XLSX.utils.json_to_sheet(withHeader,
        { header: ['id', 'fullName', 'username', 'faceClaim', 'birthday', 'birthplace', 'hobby', 'specialty', 'funFact', 'skills', 'createdAt'], skipHeader: true }
    );
    workbook.Sheets["Rents"] = worksheet;

    var exportedFile = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
    saveAs(new Blob([s2ab(exportedFile)], { type: "application/octet-stream" }), 'cabin-athena-database.xlsx');
}

function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf);  //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}