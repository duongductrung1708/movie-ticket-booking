import "./chartBox.scss";

type Props = {
  title: string;
  number: number | string;
};

const ChartBox = (props: Props) => {
  return (
    <div className="chartBox">
      <div className="boxInfo">
        <div className="title">
          <img src="/userIcon.svg" alt="" />
          <span>{props.title}</span>
        </div>
        <h1>{props.number}</h1>
      </div>
    </div>
  );
};

export default ChartBox;
