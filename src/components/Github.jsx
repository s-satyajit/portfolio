import React from "react";
import { Row } from "react-bootstrap";
import GitHubCalendar from "react-github-calendar";
import { SectionWrapper } from "../hoc";
import { color, motion } from "framer-motion";
import { styles } from "../styles";
import { textVariant } from "../utils/motion";

function Github() {
  return (
    <>
      <motion.div variants={textVariant()}>
        <h2 className={`${styles.sectionHeadText} text-center`}>
        {/* Days I <span style={{ color: "#26A641" }}>C<span style={{ color: "#39D353" }} >o</span>de</span> */}
        <span style={{color: "#9be9a8"}}>D</span>
        <span style={{color: "#30c463"}}>a</span>
        <span style={{color: "#30a14e"}}>y</span>
        <span style={{color: "#216e39"}}>s</span>
        <span> </span>
        <span style={{color: "#39d353"}}>I</span>
        <span> </span>
        <span style={{color: "#39d353"}}>C</span>
        <span style={{color: "#26a641"}}>o</span>
        <span style={{color: "#006d32"}}>d</span>
        <span style={{color: "#0e4429"}}>e</span>
        </h2>
      </motion.div>

      <div style={{ textAlign: "center" }}>
        <Row
          style={{
            justifyContent: "center",
            paddingBottom: "10px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <GitHubCalendar
            username="s-satyajit"
            blockSize={15}
            blockMargin={5}
            fontSize={16}
            color="#9556CB"
          />
        </Row>
      </div>
    </>
  );
}

export default SectionWrapper(Github, "github");
