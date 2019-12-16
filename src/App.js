import React, { useState, useRef, useEffect } from "react";
import { Input, Slider, InputNumber } from "antd";
// import katex from "katex";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

function monthlyPayment(loanAmount, nPayments, interestRate) {
  const monthlyRate = interestRate / 100 / 12;

  const numerator = monthlyRate * Math.pow(1 + monthlyRate, nPayments);
  const denominator = Math.pow(1 + monthlyRate, nPayments) - 1;
  return (loanAmount * numerator) / denominator;
}

const Equation = ({ className, loanAmount, interestRate }) => {
  const interestRateFixed = (interestRate / 100).toFixed(3);
  const monthlyRate = (interestRate / 100 / 12).toFixed(5);

  return (
    <div className={className}>
      <BlockMath math={`A = \\text{monthly payment amount}`} />
      <BlockMath math={`P = \\text{loan amount} = ${loanAmount}`} />
      <BlockMath
        math={`i = \\text{monthly interest rate} = \\frac{${interestRateFixed}}{12} = ${monthlyRate}`}
      />
      <BlockMath math={`n = \\text{number of payments} = 360`} />
      <hr />
      <BlockMath
        math={`A = P\\left(\\frac{i(1 + i)^n}{(1 + i)^n - 1}\\right)`}
      />
    </div>
  );
};

function App() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [nPayments, setNPayments] = useState(360);
  const [interestRate, setInterestRate] = useState(4.5);

  return (
    <div className="container mx-auto">
      <h1 className="text-gray-800 text-2xl mb-6">Mortgage Calculator</h1>

      <div className="flex flex-row">
        <div className="flex flex-col w-1/2 mt-6">
          <div className="relative border-solid border-t border-gray-200 pt-3 mb-4">
            <h2
              style={{ top: -13 }}
              className="text-gray-600 absolute bg-white pr-2"
            >
              Loan Amount
            </h2>
            <div className="flex flex-row mb-3">
              <InputNumber
                style={{ width: "8rem", marginRight: "1rem" }}
                size="large"
                formatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={100000}
                max={2000000}
                step={10000}
                value={loanAmount}
                onChange={setLoanAmount}
              />

              <Slider
                className="flex-grow"
                tipFormatter={value =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                min={100000}
                max={2000000}
                step={10000}
                value={loanAmount}
                onChange={setLoanAmount}
              />
            </div>
          </div>

          <div className="relative border-solid border-t border-gray-200 pt-3 mb-4">
            <h2
              style={{ top: -13 }}
              className="text-gray-600 absolute bg-white pr-2"
            >
              Interest Rate
            </h2>
            <div className="flex flex-row mb-3">
              <InputNumber
                style={{ width: "8rem", marginRight: "1rem" }}
                size="large"
                formatter={value => `${value}%`}
                parser={value => value.replace("%", "")}
                min={1}
                max={10}
                step={0.1}
                value={interestRate}
                onChange={setInterestRate}
              />
              <Slider
                className="flex-grow"
                tipFormatter={value => `${value}%`}
                min={1}
                max={10}
                step={0.1}
                value={interestRate}
                onChange={setInterestRate}
              />
            </div>
          </div>
          <h2 className="text-gray-600 mb-0">Monthly Payment</h2>
          <h1 className="text-5xl text-gray-700">
            {`$${monthlyPayment(loanAmount, nPayments, interestRate).toFixed(
              0
            )}`}
          </h1>
        </div>

        <Equation
          className="mx-auto text-base text-gray-700 bg-gray-100 py-4 px-10 rounded-lg"
          loanAmount={loanAmount}
          interestRate={interestRate}
        />
      </div>
    </div>
  );
}

export default App;
