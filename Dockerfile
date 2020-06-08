FROM tensorflow/serving:2.2.0-rc2

RUN apt-get update && apt-get install -y curl

ENV MODEL_NAME sentqam

WORKDIR /models

RUN curl -L https://tfhub.dev/google/universal-sentence-encoder-multilingual-qa/3?tf-hub-format=compressed --output sentqam.tar.gz

RUN  mkdir -p sentqam/3/ & tar -zxf sentqam.tar.gz --directory sentqam/3/
