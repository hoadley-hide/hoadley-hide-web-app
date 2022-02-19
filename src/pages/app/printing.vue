<template>
  <v-row>
    <v-col cols="12" sm="6">
      <v-card>
        <v-card-title class="text-h3">All QR Codes</v-card-title>

        <v-card-text>
          <v-radio-group v-model="entityType">
            <v-radio
              v-for="entityType in entityTypes"
              :key="entityType.value"
              :label="entityType.label"
              :value="entityType.value"
            ></v-radio>
          </v-radio-group>

          <v-radio-group v-model="printableQuantity">
            <v-radio
              v-for="option in printableQuantityOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></v-radio>
          </v-radio-group>

          <v-btn
            block
            text
            color="warning"
            @click="printQrCodes()"
            :loading="printerLoading"
          >
            <v-icon left>mdi-printer</v-icon>
            Print All
          </v-btn>
          <div ref="printarea" class="d-none">
            <div
              v-for="item in imageDataList"
              :key="item.id"
              class="small-qr-code"
            >
              <h1>Hoadley Hide 2022</h1>
              <h2>Monster Hunters</h2>
              <div><img :src="item.image" alt="QR Code" /></div>
              <pre>{{ item.code }}</pre>
              <h3>{{ item.name }}</h3>
              <p>
                Scan this QR Code or go to <br />
                <code>{{ $config.baseUrl }}/scan</code> <br />
                to continue the adventure
              </p>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col
              v-for="codeEntity in codeEntities"
              v-bind:key="codeEntity.code"
              cols="12"
              md="6"
              lg="4"
            >
              <p>
                <strong>{{ entityType | capitalize }}: </strong>
                <code>{{ codeEntity.name }}</code>
              </p>
              <div class="d-flex justify-space-around">
                <qr-code
                  :entity="codeEntity"
                  @image-data="handleImageDataUpdate"
                ></qr-code>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { setBreadcrumbs } from "~/common/helper-factories";
import { QrCodeableEntity, CodeEntity } from "~/types";

export default {
  data() {
    return {
      printerLoading: false,
      entityType: "patrol" as QrCodeableEntity["_type"],
      entityTypes: [
        { label: "Admins", value: "admin" },
        { label: "Event Stage", value: "eventStage" },
        { label: "Monster Hunt Monsters", value: "monsterHuntMonster" },
        { label: "Patrols", value: "patrol" },
        { label: "Stunts", value: "stunt" },
      ] as { label: string; value: QrCodeableEntity["_type"] }[],
      printableQuantity: 1,
      entityImageData: {},
      cssText: `
        * {
          padding: 0;
          margin: 0;
        }
        body {
          font-size: 1rem;
          width: 100%;
          text-align:center;
          padding-top:4rem;
        }
        @font-face {
          font-family: "Geizer";
          font-style: normal;
          font-weight: 400;
          src: local("Geizer"), url(/_nuxt/src/fonts/Geizer.woff) format("woff"), url("https://fonts.cdnfonts.com/s/16304/Geizer.woff") format("woff");
        }
        .small-qr-code {
          width: 30vw;
          display: inline-block;
          padding-bottom: 1rem;
        }
        h1, h2 {
          font-family: "Geizer", Arial, Helvetica, sans-serif;
        }
        not(h1),not(h2) {
          font-family:  Arial, Helvetica, sans-serif
        }
        img {
          width: calc( 65vw / 3 );
          height: calc( 65vw / 3 );
        }
        h3 {
          font-size: 1rem;
        }
        p {
          padding-top:0.5rem;
          font-size: 0.6rem;
        }
      `,
    };
  },
  computed: {
    printableQuantityOptions() {
      return [
        { label: `1 code x 9 ${this.entityType}s`, value: 1 },
        { label: `3 codes x 3 ${this.entityType}s`, value: 3 },
        { label: `9 codes x 1 ${this.entityType}`, value: 9 },
      ] as { label: string; value: number }[];
    },
    codeEntities(): CodeEntity[] {
      let entities: QrCodeableEntity[] = [];

      switch (this.entityType) {
        case "admin":
          entities = this.$store.state.admins;
          break;
        case "eventStage":
          entities = this.$store.state.eventStages;
          break;
        case "monsterHuntMonster":
          entities = this.$store.state.monsterHuntMonsters;
          break;
        case "patrol":
          entities = this.$store.state.patrols;
          break;
        case "stunt":
          entities = this.$store.state.stunts;
          break;
      }

      return entities.map(
        (entity): CodeEntity => ({
          code: entity.code,
          path: entity.path,
          name: entity.name,
        })
      );
    },
    imageDataList() {
      interface ImageData {
        id: string;
        code: string;
        image?: string;
        name: string;
      }
      const printableData = this.codeEntities.flatMap((entity): ImageData[] => {
        const arrayOfPrintable: ImageData[] = [];
        for (let i = 0; i < this.printableQuantity; i++) {
          const imageData: ImageData = {
            id: `${entity.code}-${i}`,
            code: entity.code,
            image: this.entityImageData[entity.code],
            name: entity.name,
          };
          arrayOfPrintable.push(imageData);
        }

        return arrayOfPrintable;
      });

      return printableData;
    },
  },
  mounted() {
    setBreadcrumbs(this.$store, [
      { to: "/", label: "Home" },
      { to: "/app", label: "App" },
      { to: null, label: "Printing List" },
    ]);
  },
  methods: {
    handleImageDataUpdate({ dataUri, entityCode }) {
      this.$set(this.entityImageData, entityCode, dataUri);
      // this.entityImageData[entityCode] = dataUri;
    },
    printQrCodes() {
      this.printerLoading = true;

      const printerEl = this.$refs["printarea"];

      if (!this.$Printd || !printerEl) {
        return;
      }

      const printer = new this.$Printd();
      setTimeout(() => {
        printer?.print(printerEl, [this.cssText]);
        this.printerLoading = false;
      }, 1000);
    },
  },
};
</script>
