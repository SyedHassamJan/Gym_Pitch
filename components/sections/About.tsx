import { about, hours, schedule, programName, site } from "@/lib/content";
import { Reveal } from "@/components/motion/Reveal";

export function About() {
  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__copy">
          <h2 id="about-title" className="display h-section">
            {about.heading}
          </h2>
          <p className="lead">{about.body}</p>
          <dl className="facts">
            <div>
              <dt>Open</dt>
              <dd>
                {hours.label}, {hours.open} to {hours.close}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {site.address ? site.address : <span className="fill">street address to be added</span>}, {site.city}
              </dd>
            </div>
            <div>
              <dt>First visit</dt>
              <dd>A free trial class, booked on WhatsApp</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal>
          <table className="timetable">
            <caption>Group classes this week</caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Time</th>
                <th scope="col">Class</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row) => (
                <tr key={row.day}>
                  <th scope="row">{row.day}</th>
                  <td className="num">{row.time}</td>
                  <td>{programName(row.program)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </div>
    </section>
  );
}
