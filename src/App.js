import React, { useState, useRef, useEffect } from "react";
import { Input, Slider, InputNumber } from "antd";
// import katex from "katex";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import {
  LineChart,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

function pFunc(P, A, i) {
  return function p(t) {
    const r = 1 + i / 12;
    return P * Math.pow(r, t) - (A * (Math.pow(r, t) - 1)) / (r - 1);
  };
}

function CustomTooltip({ payload, label, active }) {
  if (active) {
    // console.log(, label, active);
    const p = payload[0].payload;
    console.log();
    const t = Math.floor(p.data)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
      <div className="custom-tooltip">
        <div>
          <span className="font-bold text-gray-800">Month:</span> {p.t}
        </div>
        <div>
          <span className="font-bold text-gray-800">Amount Left:</span> ${t}
        </div>
      </div>
    );
  }

  return null;
}

const Chart = ({ P, A, i }) => {
  const p = pFunc(P, A, i);
  const data2 = Array.from({ length: 360 }).map((_, t) => ({
    t,
    data: p(t)
  }));

  return (
    <div className="mt-4" style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data2}
          margin={{
            top: 5,
            right: 30,
            left: 30,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="t"
            interval={11}
            tickFormatter={value => Math.floor(value / 12)}
          />
          <YAxis
            tickFormatter={value =>
              `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="data"
            stroke="#91d5ff"
            fill="#91d5ff"
            fillOpacity={0.5}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

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
                  `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                  `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

      <Chart
        P={loanAmount}
        A={monthlyPayment(loanAmount, nPayments, interestRate)}
        i={interestRate / 100}
      />
    </div>
  );
}

export default App;
