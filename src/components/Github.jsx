import React from "react";
import { Row } from "react-bootstrap";
import GitHubCalendar from "react-github-calendar";
import { SectionWrapper } from "../hoc";

function Github() {
  return (
    <div style={{ textAlign: "center" }}>
      <Row style={{ justifyContent: "center", paddingBottom: "10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 className="project-heading">
          Days I <strong className="purple">Code</strong>
        </h1>
        <GitHubCalendar
          username="s-satyajit"
          blockSize={15}
          blockMargin={5}
          fontSize={16}
          color="ffffff"
        />
      </Row>
    </div>
  );
}

export default SectionWrapper(Github, "github");
