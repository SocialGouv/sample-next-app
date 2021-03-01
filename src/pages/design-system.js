import React from "react";

import {
  Button,
  Callout,
  Card,
  Col,
  Grid,
  Icon,
  icons,
  Link,
} from "../components/dse";

const Cards = () => (
  <div>
    <h2>Cards</h2>
    <Grid gutters>
      <Col md={3}>
        <Card
          title={
            <Link href="/colors">
              <a className="rf-card__link">Couleurs</a>
            </Link>
          }
        >
          Toutes les couleurs
        </Card>
      </Col>
      <Col md={3}>
        <Card title="Hello">lblala</Card>
      </Col>
      <Col md={3}>
        <Card title="Hello">lblala</Card>
      </Col>
    </Grid>
  </div>
);

const Buttons = () => (
  <div>
    <h2>Buttons</h2>
    <h3>default</h3>
    <Button>basic</Button>
    <br />
    <br />
    <Button disabled>basic disabled</Button>
    <h3>variant=&quot;secondary&quot;</h3>
    <Button variant="secondary">variant </Button>
    <br />
    <br />
    <Button disabled variant="secondary">
      variant{" "}
    </Button>
    <h3>icon=&quot;checkbox-line&quot; iconPosition=&quot;left&quot;</h3>
    <Button icon="checkbox-line" iconPosition="left">
      with left icon
    </Button>
    <br />
    <br />
    <Button disabled icon="checkbox-line" iconPosition="left">
      with left icon
    </Button>
    <br />
    <br />
    <Button icon="checkbox-line" variant="secondary" iconPosition="left">
      with left icon
    </Button>
    <br />
    <br />
    <Button
      disabled
      icon="checkbox-line"
      variant="secondary"
      iconPosition="left"
    >
      with left icon
    </Button>
    <h3>icon=&quot;checkbox-line&quot; iconPosition=&quot;right&quot;</h3>
    <Button icon="checkbox-line" iconPosition="right">
      with right icon
    </Button>
    <br />
    <br />
    <Button disabled icon="checkbox-line" iconPosition="right">
      with right icon
    </Button>
    <h3>icon=&quot;checkbox-line&quot;</h3>
    <Button icon="checkbox-line">icon only</Button>
    <br />
    <br />
    <Button disabled icon="checkbox-line">
      icon only
    </Button>
    <h3>size=&quot;sm&quot;</h3>
    <Button size="sm">button sm</Button>
    <br />
    <br />
    <Button size="sm" disabled>
      button sm
    </Button>
    <br />
    <br />
    <Button size="sm" icon="checkbox-line" iconPosition="left">
      button+icon sm
    </Button>
    <br />
    <br />
    <Button size="sm" icon="checkbox-line">
      button+icon sm
    </Button>
  </div>
);

const Icons = () => (
  <div>
    <h2>Icons</h2>
    {icons.map((icon) => (
      <div key={icon}>
        <Icon icon={icon} />
        <Icon icon={icon} size="lg" /> {icon}
      </div>
    ))}
  </div>
);

const DesignSystem = () => (
  <div>
    <Callout>
      Voir la{" "}
      <a href="https://gouvfr.atlassian.net/wiki/spaces/DB/overview?homepageId=145359476">
        documentation officielle du design system
      </a>{" "}
      et la{" "}
      <a href="https://template.incubateur.net">
        démo d&apos;implémentation HTML
      </a>
      .
    </Callout>
    <Cards />
    <Buttons />
    <Icons />
  </div>
);

export default DesignSystem;
