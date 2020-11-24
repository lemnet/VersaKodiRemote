import { gettext } from "i18n";

function Settings(props) {
  return (
    <Page>
      <Section title={<Text></Text>}>
      </Section>
      <Section title={<Text></Text>}>
        <Text bold align="center">{gettext("kodi_settings")}</Text>
      </Section>
      <Section title={<Text></Text>}>
        <TextInput label={gettext("kodi_ip")} settingsKey="ip" placeholder="192.168.1.1"/>
        <TextInput label={gettext("kodi_port")} settingsKey="port" placeholder="8181"/>
        <TextInput label={gettext("kodi_login")} settingsKey="login" placeholder="kodi"/>
        <TextInput label={gettext("kodi_pass")} settingsKey="pass" placeholder="" type="password"/>
      </Section>
      <Section title={<Text></Text>}>
        <Text bold align="center">{gettext("contact")}</Text>
      </Section>
      <Section title={<Text></Text>}>
        <Text>{gettext("contacttxt")}</Text>
        <Link source="https://github.com/lemnet/VersaKodiRemote">https://github.com/lemnet/VersaKodiRemote</Link>
      </Section>
      <Section title={<Text></Text>}>
        <Text bold align="center">{gettext("licences")}</Text>
      </Section>
      <Section title={<Text></Text>}>
        <Text>{gettext("lic_kodi")} <Link source="https://kodi.tv/">Kodi</Link></Text>
        <Link source="https://github.com/xbmc/xbmc/tree/master/LICENSES">{gettext("licence")}</Link>
      </Section>

    </Page>
  );
}

registerSettingsPage(Settings);