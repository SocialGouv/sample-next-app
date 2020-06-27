import { metadataFromParams } from "@socialgouv/kosko-charts/components/app/metadata";
import env from "@kosko/env";
import { SealedSecret } from "@kubernetes-models/sealed-secrets/bitnami.com/v1alpha1/SealedSecret";

const params = env.component("hasura");

const secret = new SealedSecret({
  metadata: {
    ...metadataFromParams(params),
    name: `hasura-env-${process.env.CI_COMMIT_SHORT_SHA}`,
    annotations: {
      "sealedsecrets.bitnami.com/cluster-wide": "true",
    },
  },
  spec: {
    encryptedData: {
      ACCOUNT_EMAIL_SECRET:
        "AgA8wmcTYdtsMQlSPr2PtJNzTreTJ2CLEsa0V/pK3WI6A87RBUJcrPKQJorlWV7U2/vG6s7YeEWn/4elgnCsIx0Heq05DilLNVFUHsFJ3NGbZ1pu279LNgvHa0jOVRnv7v2FFvDp0al+p0eMVtoU7+ovyXFqm/Mm761ZZX/7mU+2eERssgWZ4WqkXRJGe5C8jSqxg8/mz5zDzj1U+nGh5nzGhmJWp8pKhW6U17daFYAT/ixrN3TqN5a3y7DpKzV3Y4gHdyGmcxuTekninN3F37MGBtA3CJxKp8hY1pCu1Chte0VfZmBwvnuh6l/uTU2iErV8+VeKfW4mWbMJraX6lS+sfBMxBdXLlTXT2UmJREsnoYItgBYtpRZTeM2v0hZt9ScXyOJ/I8gBai+0yHwlLFnL4N7DOMzUfRa1UUFoJusDFSsFSmu64KMeGdU2dzf1jEiILzeBDhYT9QsWJx3/oquBsfDaxstOp0B7SRZn7QLywQvosfkCHtJeGafG5zmKn42htliChSjZPeVn0y1StXc11N4Wfgz3EyscCj1l0S3GtQEK0NJSO+hgACm9E2QaU1RlzFuzugdSz1UntmwR6NgVN5yLHADbanKo4LDS/Z8fN5m0qDVwP1Z99DkEE1P82bAs1T5sOn6ZrJiIhuFCHWouwYjvuMOhEoddL42VwuPg5G0rTtovn3a9c7FrmXY9lZWR4NGTMHMbNYc+UeCUkTA=",
      //      HASURA_GRAPHQL_ADMIN_SECRET:
      //     "AgCAqhKgc3PtqkQnkPeR0pAyh5bkICHiNpYkHBwRAhRCSo4kktC4p1/OJapMewk2glYBZHdUIad4JEn1V7/EvfMkWs7Eh7CXLYQB8xdJxbl7tyopNSppQxLA2YkMTPmnja5kGJrf2nvZNR1u7aQ7z5ZuP9KFzPsWTj/pFQiczsoyhNrKJmSeAUMRKophVfgKDdvNuM6ZEuSiR9iGhhrGJVD1gHlQaOW0JKCjweuC0opYdP/rlZOD6BvqzlaYc+dHVYbot7ktDzYT98YCIJdS0sKe0/6+L/CQgWeqAUxZxyPrtOk5BsBOXKNuXIrG9sQQ8SXSykubqYRGdClVv6TlazMXvBtuoind14bkJ1G4Are0FsokIPoJxrYAM1Nd4hKvRJvT3BiiEY2JdqRbmeHyZc+yCYUeUkvbtVIHFHGnSjVzAfriR6mLj4psmUGAtjq7qqaa6fJQb1fRr6pnb6//i6B6NjspyMHNi5uwLCn3Rvrqbq0abgtZCh1PUPZeqA/kAENyg3FunPzxiCdlHJnKch7lQDSkoQDukEGWipUnr9/ICfMuAMlu1uTHqjjGrsZoewqY00MHkPNyFiHVwYmEqY9INfmEH9G5UBLaWTorLyvleJUK60d8ZteFArZlskOs82gtcVhYGtE1TZ3VSn/sGKHdC53BlWJ5b65GKP8bn1xKmuu+ah3+NNWkgTydoKzTjHxOiX3FVeDHyVM9v3Xyv/6/Z8KCvRw9cgbmcX+PkTifzsT/10iGvP+aa/8+3tOmikLHHGpTyALG9YOZ4MPOHR5owd1xI0TUm++0+JgxYfeNny+Ybk0O0x/ikVx+gSDR7MKDD9sI2V6wX8cJKpl6hLFIxFV0EUCwHiWW0N5ZnXJarMMhMWzV+4YaD0c6ZxhDgizvIX6nOs0aEihvFBVBgZuiIiO3RW0fUDel0kcqzg==",
      //   HASURA_GRAPHQL_JWT_SECRET:
      //     "AgAnThMc6uuayn1BR4rLy65IoFDsv8pzBpphbYxf36e4OJooSi9s2upWe8g3HpVfdb5SthH77uw+64Ks+Tvku1gHrUOOXh89F+RS1mLwBfNhe4Nlf55AosasYsUOjE5mWOd0Czdp723ujL9T1SoZNyGeGyG2ZPxR+clgBJIgX5fRMvfi76SSq5trUasItHflHp+io2leMD8QBB0jukLf8vmHHCZ36S1hwtISj7NMHtiv4bl2AQPj6KjyO2U0AB+Uf+Un21RwCRsXv4mDkKNZAGSMn67IkqLRK02TFJQRz4qn+WrX4DPkgNG+fELYHBK0CSi8orSN07Z0qY4y86IYbXRiqJDDKIXq6jNQ2V3Ffox8uNNPk8BJ4lrxz4Bn9r9/rTWRLS70Uzv+OXViJ2xcb4HxBZFSKucOVK4Gx8kFf5xoKd6LV6g6kbjtYQUR4FGQihvZYsDrr5qGv1rxHO7EkY4o9Hre2iHVQJ08imfDoXscfzeJC9lxo/e5M7LusDtIkzwkMkmsv8WXMlGjfg4JoYiQzVA8oMsmeWQLHNdJUdSkZF8tFc3skvgYEeMuDi89KRiuCOwnShrVLzPzYbWO+7dwnyay5NVvtvNE9kXYn5U4EwGExeLGWoRRrDCOUM9sgwAJF7AcDcQUQ+MWupWacW7YE+VjBMuDmJR+1Gx9qDXGUspG1DkDfKqLCxT1L2RoMlbIfubACEYYbZ5IiooqjwbHCMUzbr4aRNSM2C3KqN8wSlB18xVfrgVpWYqZFtXWjJAgvLbn5Pi6ryaBPy/adnlBpGf1S2EakV9uR6gdpsKR1yTmzNT7MCIiInzvq/KijQCiJwAyqIkpU+tQv+HInHxWZQ==",
      // },
    },
  },
});

export default [secret];
