const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

let votes = [];
let voters = new Set();
const maxVotes = 14;

app.post('/vote', (req, res) => {
    const { voterName, name1, name2, name3 } = req.body;

    if (voters.has(voterName)) {
        return res.status(400).send('You have already voted.');
    }

    if (!name1 || !name2 || !name3) {
        return res.status(400).send('Please enter all three names.');
    }

    votes.push({ name: name1, points: 3 });
    votes.push({ name: name2, points: 2 });
    votes.push({ name: name3, points: 1 });
    voters.add(voterName);

    if (voters.size >= maxVotes) {
        return res.send(calculateResults());
    }

    res.send(`Vote submitted. ${maxVotes - voters.size} votes remaining.`);
});

function calculateResults() {
    let results = {};

    votes.forEach(vote => {
        if (!results[vote.name]) {
            results[vote.name] = 0;
        }
        results[vote.name] += vote.points;
    });

    let sortedResults = Object.keys(results).map(name => {
        return { name: name, points: results[name] };
    }).sort((a, b) => b.points - a.points);

    return sortedResults;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
