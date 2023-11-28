import fs from 'fs';
import fetch from 'node-fetch';
import * as OpenAI from 'openai';

const { createReadStream } = fs;
const { create } = fetch;

const openai = new OpenAI({ key: 'your-api-key' }); 



// If you have access to Node fs we recommend using fs.createReadStream():
await openai.files.create({ file: fs.createReadStream('mydata.jsonl'), purpose: 'fine-tune' });

// Or if you have the web File API you can pass a File instance:
await openai.files.create({ file: new File(['my bytes'], 'mydata.jsonl'), purpose: 'fine-tune' });

// You can also pass a fetch Response:
await openai.files.create({ file: await fetch('http://localhost:3000/chatData'), purpose: 'fine-tune' });

//create a fine tuned model
const createfineTune = await openai.fineTuning.jobs.create({ training_file: 'file-abc123', model: 'gpt-3.5-turbo' })

//iterating the hyper parameters
const iteratefineTune = await openai.fineTuning.jobs.create({training_file: "file-abc123", model: "gpt-3.5-turbo", hyperparameters: { n_epochs: 2 }});

// # List 10 fine-tuning jobs
let page = await openai.fineTuning.jobs.list({ limit: 10 });

// # Retrieve the state of a fine-tune
let fineTune = await openai.fineTuning.jobs.retrieve('ftjob-abc123');

// # Cancel a job
let status = await openai.fineTuning.jobs.cancel('ftjob-abc123');

// # List up to 10 events from a fine-tuning job
let events = await openai.fineTuning.jobs.listEvents(fineTune.id, { limit: 10 });

// # Delete a fine-tuned model (must be an owner of the org the model was created in)
let model = await openai.models.delete('ft:gpt-3.5-turbo:acemeco:suffix:abc123')

// using a fine tuned model 
async function main() {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "ft:gpt-3.5-turbo:my-org:custom_suffix:id",
    });
    console.log(completion.choices[0]);
  }
  main();

  //analyzing fine tuned model
//   {
//     "object": "fine_tuning.job.event",
//     "id": "ftevent-abc-123",
//     "created_at": 1693582679,
//     "level": "info",
//     "message": "Step 100/100: training loss=0.00",
//     "data": {
//         "step": 100,
//         "train_loss": 1.805623287509661e-5,
//         "train_mean_token_accuracy": 1.0
//     },
//     "type": "metrics"
// }




