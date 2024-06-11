import { Reporter, TestCase } from "@playwright/test/reporter";
import moment from "moment";

class BasicReporter implements Reporter {
  listResults: Array<string> = [];

  onTestEnd(test: TestCase, result: any) {
    const testResult = result.status;
    const testSuite = test.parent.title;
    const testTitle = test.title;

    const printResult = `${testResult} | ${testSuite} > ${testTitle}`;

    return this.listResults.push(printResult);
  }

  onEnd(result: any): void {
    const currentTimestamp = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");

    console.log("\nReport made at ", currentTimestamp);

    const listedResults = `${this.listResults.join("\n")}`;
    console.log(listedResults);

    const suiteResult = result.status;
    console.log("Suite total result: ", suiteResult);
  }
}

export default BasicReporter;